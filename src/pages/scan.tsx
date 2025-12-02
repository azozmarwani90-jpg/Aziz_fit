import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { insertMeal, insertAiLog } from '@/services/database';
import { MEAL_TYPES } from '@/types/database';
import toast from 'react-hot-toast';

interface MealAnalysisResult {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal_type: string;
  description?: string;
}

export default function ScanPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<MealAnalysisResult | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('الرجاء اختيار صورة');
      return;
    }

    setSelectedFile(file);
    setResult(null);
    setImageUrl(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !user) {
      toast.error('الرجاء اختيار صورة');
      return;
    }

    setAnalyzing(true);

    try {
      // Create FormData and send file
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('userId', user.id);

      // Call API
      const response = await fetch('/api/analyze-meal', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'فشل تحليل الصورة');
      }

      // Store both meal data and image URL from API
      setResult(data.meal);
      setImageUrl(data.image_url);
      toast.success('تم تحليل الوجبة بنجاح!');
    } catch (error) {
      console.error('Analysis error:', error);
      const errorMessage = error instanceof Error ? error.message : 'فشل تحليل الصورة. حاول مرة أخرى';
      toast.error(errorMessage);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!result || !imageUrl) {
      toast.error('لا توجد بيانات للحفظ');
      return;
    }

    setSaving(true);

    try {
      // Save meal to database with image URL from API
      await insertMeal({
        name: result.name,
        calories: result.calories,
        protein: result.protein,
        carbs: result.carbs,
        fat: result.fat,
        meal_type: result.meal_type as 'breakfast' | 'lunch' | 'dinner' | 'snack',
        image_url: imageUrl,
      });

      // Log AI interaction
      await insertAiLog(
        'تحليل صورة وجبة',
        JSON.stringify(result),
        imageUrl
      );

      // Show success message
      toast.success('تم حفظ الوجبة بنجاح!');
      
      // Redirect to dashboard immediately
      router.push('/dashboard');
    } catch (error) {
      console.error('Save error:', error);
      const errorMessage = error instanceof Error ? error.message : 'فشل حفظ الوجبة';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (authLoading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            تحليل وجبة
          </h1>
          <p className="text-gray-600">التقط صورة للوجبة وسنحسب معلوماتها الغذائية</p>
        </div>

        {/* Upload Section */}
        {!preview && (
          <div className="card text-center animate-fade-in">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-4 border-dashed border-gray-300 rounded-3xl p-12 cursor-pointer hover:border-emerald-400 transition-colors"
            >
              <div className="text-6xl mb-4">📸</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                اختر صورة للوجبة
              </h3>
              <p className="text-gray-500 mb-4">انقر لاختيار صورة من جهازك</p>
              <button className="btn-primary">اختر صورة</button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        )}

        {/* Preview and Analysis Section */}
        {preview && (
          <div className="space-y-6 animate-fade-in">
            <div className="card">
              <img
                src={preview}
                alt="Meal preview"
                className="w-full h-96 object-cover rounded-2xl mb-4"
              />
              <div className="flex gap-4">
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing || result !== null}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  {analyzing ? (
                    <span className="flex items-center justify-center">
                      <div className="spinner w-5 h-5 ml-2"></div>
                      جاري التحليل...
                    </span>
                  ) : result ? (
                    'تم التحليل ✓'
                  ) : (
                    'تحليل الوجبة'
                  )}
                </button>
                <button onClick={handleReset} className="btn-secondary">
                  اختر صورة أخرى
                </button>
              </div>
            </div>

            {/* Results Card */}
            {result && (
              <div className="card animate-fade-in">
                <h2 className="text-2xl font-bold text-luxury-black mb-6">
                  نتائج التحليل
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                    <span className="text-gray-700 font-medium">اسم الوجبة</span>
                    <span className="text-lg font-bold text-luxury-black">{result.name}</span>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-xl">
                    <span className="text-gray-700 font-medium">السعرات</span>
                    <span className="text-lg font-bold text-emerald-600">
                      {result.calories} سعرة
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-red-50 rounded-xl">
                    <span className="text-gray-700 font-medium">البروتين</span>
                    <span className="text-lg font-bold text-red-600">{result.protein} جم</span>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-xl">
                    <span className="text-gray-700 font-medium">الكربوهيدرات</span>
                    <span className="text-lg font-bold text-yellow-600">{result.carbs} جم</span>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl">
                    <span className="text-gray-700 font-medium">الدهون</span>
                    <span className="text-lg font-bold text-blue-600">{result.fat} جم</span>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-purple-50 rounded-xl">
                    <span className="text-gray-700 font-medium">نوع الوجبة</span>
                    <span className="text-lg font-bold text-purple-600">
                      {MEAL_TYPES[result.meal_type as keyof typeof MEAL_TYPES]}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full btn-primary disabled:opacity-50"
                >
                  {saving ? (
                    <span className="flex items-center justify-center">
                      <div className="spinner w-5 h-5 ml-2"></div>
                      جاري الحفظ...
                    </span>
                  ) : (
                    'حفظ الوجبة'
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
