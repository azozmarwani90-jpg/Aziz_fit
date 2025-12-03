import { useState, useRef, ChangeEvent, useEffect, DragEvent } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { insertMeal, insertAiLog } from '@/services/database';
import { MEAL_TYPES_AR, MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from '@/constants';
import { MEAL_TYPES } from '@/types/database';
import toast from 'react-hot-toast';
import { Button, Card, PageContainer } from '@/components/ui';

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
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('الرجاء اختيار صورة');
      return;
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error('نوع الملف غير مدعوم. الرجاء اختيار JPG أو PNG');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error('حجم الملف كبير جداً. الحد الأقصى 10 ميجابايت');
      return;
    }

    setSelectedFile(file);
    setResult(null);
    setImageUrl(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !user) {
      toast.error('الرجاء اختيار صورة');
      return;
    }

    setAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('userId', user.id);

      const response = await fetch('/api/analyze-meal', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'فشل تحليل الصورة');
      }

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
      await insertMeal({
        name: result.name,
        calories: result.calories,
        protein: result.protein,
        carbs: result.carbs,
        fat: result.fat,
        meal_type: result.meal_type as 'breakfast' | 'lunch' | 'dinner' | 'snack',
        image_url: imageUrl,
      });

      await insertAiLog(
        'تحليل صورة وجبة',
        JSON.stringify(result),
        imageUrl
      );

      toast.success('تم حفظ الوجبة بنجاح!');
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
      <PageContainer
        title="تحليل وجبة"
        subtitle="التقط صورة للوجبة وسنحسب معلوماتها الغذائية"
      >
        {/* Upload Section */}
        {!preview && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <Card
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-4xl p-12 text-center cursor-pointer transition-all hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/10"
              onClick={() => fileInputRef.current?.click()}
              hoverable
            >
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`transition-all ${dragActive ? 'scale-105' : ''}`}
              >
                <div className="text-6xl mb-4 animate-pulse-subtle">📸</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  اختر صورة للوجبة
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  انقر لاختيار صورة أو اسحبها هنا
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
                  صيغ مدعومة: JPG, PNG, WebP (الحد الأقصى 10MB)
                </p>
                <Button variant="primary" size="lg">
                  اختر صورة
                </Button>
              </div>
            </Card>
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
          <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            <Card>
              <div className="rounded-3xl overflow-hidden mb-6">
                <img
                  src={preview}
                  alt="صورة الوجبة"
                  className="w-full h-96 object-cover"
                />
              </div>
              <div className="flex gap-3 flex-col sm:flex-row">
                <Button
                  onClick={handleAnalyze}
                  disabled={analyzing || result !== null}
                  loading={analyzing}
                  fullWidth
                  variant="primary"
                  size="lg"
                >
                  {result ? 'تم التحليل ✓' : 'تحليل الوجبة'}
                </Button>
                <Button
                  onClick={handleReset}
                  disabled={analyzing}
                  fullWidth
                  variant="secondary"
                  size="lg"
                >
                  اختر صورة أخرى
                </Button>
              </div>
            </Card>

            {result && (
              <Card className="animate-fade-in">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-right">
                  نتائج التحليل
                </h2>

                <div className="space-y-4 mb-8">
                  {/* Meal Name */}
                  <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">اسم الوجبة</span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{result.name}</span>
                  </div>

                  {/* Calories */}
                  <div className="flex justify-between items-center p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 border-l-4 border-emerald-500">
                    <div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium block mb-1">السعرات الحرارية</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Energy</span>
                    </div>
                    <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                      {result.calories}
                    </span>
                  </div>

                  {/* Macros Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    {/* Protein */}
                    <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/30 text-center border border-red-200 dark:border-red-800">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">البروتين</p>
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">{result.protein}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">جرام</p>
                    </div>

                    {/* Carbs */}
                    <div className="p-4 rounded-2xl bg-yellow-50 dark:bg-yellow-900/30 text-center border border-yellow-200 dark:border-yellow-800">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">الكربوهيدرات</p>
                      <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{result.carbs}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1\">جرام</p>
                    </div>

                    {/* Fat */}
                    <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-center border border-blue-200 dark:border-blue-800">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">الدهون</p>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{result.fat}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">جرام</p>
                    </div>
                  </div>

                  {/* Meal Type */}
                  <div className="flex justify-between items-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-2xl border border-purple-200 dark:border-purple-800">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">نوع الوجبة</span>
                    <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {MEAL_TYPES[result.meal_type as keyof typeof MEAL_TYPES]}
                    </span>
                  </div>

                  {/* Description */}
                  {result.description && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                      <p className="text-sm text-gray-600 dark:text-gray-400 text-right">{result.description}</p>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleSave}
                  disabled={saving}
                  loading={saving}
                  fullWidth
                  variant="primary"
                  size="lg"
                >
                  حفظ الوجبة
                </Button>
              </Card>
            )}
          </div>
        )}
      </PageContainer>
    </Layout>
  );
}
