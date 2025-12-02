import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import formidable, { File as FormidableFile } from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface ParsedForm {
  fields: formidable.Fields;
  files: formidable.Files;
}

interface MealData {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  description?: string;
}

const parseForm = (req: NextApiRequest): Promise<ParsedForm> => {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: false });
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

const validateUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('URL validation failed:', error);
    return false;
  }
};

const validateMealData = (data: any): { valid: boolean; error?: string } => {
  const requiredFields = ['name', 'calories', 'protein', 'carbs', 'fat', 'meal_type'];
  
  // Check for missing fields
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      return { valid: false, error: `حقل مطلوب مفقود: ${field}` };
    }
  }

  // Validate numeric fields
  const numericFields = ['calories', 'protein', 'carbs', 'fat'];
  for (const field of numericFields) {
    if (typeof data[field] !== 'number' || isNaN(data[field]) || data[field] < 0) {
      return { valid: false, error: `الحقل "${field}" يجب أن يكون رقماً موجباً` };
    }
  }

  // Validate meal_type enum
  const validMealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
  if (!validMealTypes.includes(data.meal_type)) {
    return { valid: false, error: `نوع الوجبة يجب أن يكون أحد: ${validMealTypes.join(', ')}` };
  }

  // Validate name is string
  if (typeof data.name !== 'string' || data.name.trim().length === 0) {
    return { valid: false, error: 'الاسم يجب أن يكون نصاً غير فارغ' };
  }

  return { valid: true };
};


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'الطريقة غير مسموحة' 
    });
  }

  try {
    // Parse form data
    const { fields, files } = await parseForm(req);
    
    const userId = Array.isArray(fields.userId) ? fields.userId[0] : fields.userId;
    const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;

    if (!imageFile) {
      return res.status(400).json({ 
        success: false, 
        error: 'الصورة مطلوبة' 
      });
    }

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'معرف المستخدم مطلوب' 
      });
    }

    // Read file
    const file = imageFile as FormidableFile;
    const fileBuffer = fs.readFileSync(file.filepath);
    const timestamp = Date.now();
    
    // Flutter-compatible filename format: userId/user_userId_meal_timestamp.jpg
    const fileName = `${userId}/user_${userId}_meal_${timestamp}.jpg`;

    // Upload to Supabase Storage with proper MIME type
    const { error: uploadError } = await supabase.storage
      .from('food_images')
      .upload(fileName, fileBuffer, {
        contentType: file.mimetype || 'image/jpeg',
        upsert: false,
        cacheControl: '3600',
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return res.status(500).json({ 
        success: false, 
        error: 'فشل رفع الصورة إلى التخزين',
        details: uploadError.message
      });
    }

    // Get public URL - matching Flutter format exactly
    const { data: { publicUrl } } = supabase.storage
      .from('food_images')
      .getPublicUrl(fileName);

    if (!publicUrl) {
      return res.status(500).json({ 
        success: false, 
        error: 'فشل الحصول على رابط الصورة' 
      });
    }

    // Validate URL is reachable
    const isUrlValid = await validateUrl(publicUrl);
    if (!isUrlValid) {
      console.error('URL validation failed:', publicUrl);
      return res.status(500).json({ 
        success: false, 
        error: 'رابط الصورة غير صالح' 
      });
    }

    // Call OpenAI Vision API with gpt-4o-mini
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        success: false, 
        error: 'مفتاح OpenAI غير مكوّن' 
      });
    }

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `أنت خبير تغذية محترف. قم بتحليل صورة الوجبة وإرجاع معلومات الوجبة بصيغة JSON فقط.
يجب أن يحتوي الرد على:
- name: اسم الوجبة بالعربية
- calories: عدد السعرات الحرارية (رقم)
- protein: كمية البروتين بالجرام (رقم)
- carbs: كمية الكربوهيدرات بالجرام (رقم)
- fat: كمية الدهون بالجرام (رقم)
- meal_type: نوع الوجبة (breakfast, lunch, dinner, أو snack)
- description: وصف مختصر للوجبة بالعربية

مثال للرد:
{
  "name": "دجاج مشوي مع أرز",
  "calories": 450,
  "protein": 35,
  "carbs": 48,
  "fat": 12,
  "meal_type": "lunch",
  "description": "وجبة متوازنة تحتوي على دجاج مشوي وأرز"
}

قم بإرجاع JSON فقط بدون نص إضافي أو markdown.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'حلل هذه الصورة وأعطني المعلومات الغذائية بصيغة JSON'
              },
              {
                type: 'image_url',
                image_url: {
                  url: publicUrl,
                },
              },
            ],
          },
        ],
        max_tokens: 500,
        temperature: 0.2,
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error('OpenAI API error:', errorData);
      return res.status(500).json({ 
        success: false, 
        error: 'فشل تحليل الصورة مع OpenAI',
        details: errorData.error?.message || 'خطأ غير معروف'
      });
    }

    const openaiData = await openaiResponse.json();
    const content = openaiData.choices[0]?.message?.content;

    if (!content) {
      return res.status(500).json({ 
        success: false, 
        error: 'لا يوجد رد من OpenAI' 
      });
    }

    // Parse JSON response - strip markdown and sanitize
    let mealData: any;
    try {
      // Remove markdown code blocks if present
      let jsonString = content.trim();
      
      // Try to extract JSON from markdown code blocks
      const jsonMatch = jsonString.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
      if (jsonMatch) {
        jsonString = jsonMatch[1].trim();
      }
      
      // Remove any leading/trailing non-JSON text
      const jsonStartIndex = jsonString.indexOf('{');
      const jsonEndIndex = jsonString.lastIndexOf('}');
      if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
        jsonString = jsonString.substring(jsonStartIndex, jsonEndIndex + 1);
      }
      
      mealData = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('OpenAI response content:', content);
      return res.status(400).json({ 
        success: false, 
        error: 'فشل تحليل استجابة الذكاء الاصطناعي',
        details: 'استجابة JSON غير صالحة'
      });
    }

    // Validate meal data matches Flutter format exactly
    const validation = validateMealData(mealData);
    if (!validation.valid) {
      console.error('Validation error:', validation.error);
      console.error('Received data:', mealData);
      return res.status(400).json({ 
        success: false, 
        error: 'صيغة بيانات الوجبة غير صحيحة',
        details: validation.error
      });
    }

    // Return success response - matching Flutter format exactly
    return res.status(200).json({
      success: true,
      meal: {
        name: mealData.name,
        calories: mealData.calories,
        protein: mealData.protein,
        carbs: mealData.carbs,
        fat: mealData.fat,
        meal_type: mealData.meal_type,
        description: mealData.description || '',
      },
      image_url: publicUrl,
    });

  } catch (error) {
    console.error('Error in analyze-meal API:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'خطأ في الخادم',
      details: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }
}
