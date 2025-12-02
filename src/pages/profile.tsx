import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { useDailyGoals } from '@/hooks/useDailyGoals';
import { updateDailyGoals } from '@/services/database';
import { formatCalories, formatMacros } from '@/utils/formatters';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { goals, loading: goalsLoading, refetch } = useDailyGoals();
  const [showEditGoals, setShowEditGoals] = useState(false);
  const [formData, setFormData] = useState({
    weight: 70,
    height: 170,
    age: 30,
    gender: 'male' as 'male' | 'female',
    activityLevel: 'moderate' as 'sedentary' | 'light' | 'moderate' | 'heavy' | 'athlete',
  });
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleCalculateGoals = async () => {
    setCalculating(true);

    try {
      await updateDailyGoals(
        formData.weight,
        formData.height,
        formData.age,
        formData.gender,
        formData.activityLevel
      );
      toast.success('تم حساب الأهداف اليومية بنجاح!');
      setShowEditGoals(false);
      refetch();
    } catch (error) {
      toast.error('فشل حساب الأهداف');
    } finally {
      setCalculating(false);
    }
  };

  if (authLoading || goalsLoading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info Card */}
        <div className="card text-center mb-8 animate-fade-in">
          <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-5xl">👤</span>
          </div>
          <h2 className="text-2xl font-bold text-luxury-black mb-2">{user?.email}</h2>
          <p className="text-gray-600">مستخدم نشط</p>
        </div>

        {/* Daily Goals Card */}
        <div className="card mb-8 animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-luxury-black flex items-center">
              <div className="w-1 h-8 bg-gradient-primary rounded-full ml-3"></div>
              الأهداف اليومية
            </h3>
            <button
              onClick={() => setShowEditGoals(!showEditGoals)}
              className="btn-secondary"
            >
              {showEditGoals ? 'إلغاء' : 'تعديل الأهداف'}
            </button>
          </div>

          {showEditGoals ? (
            /* Edit Goals Form */
            <div className="space-y-6">
              <div className="p-4 bg-emerald-50 rounded-xl mb-4">
                <p className="text-emerald-700 font-medium">
                  ℹ️ سنقوم بحساب احتياجاتك اليومية بناءً على معلوماتك
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    الوزن (كجم)
                  </label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                    className="input-field"
                    min="30"
                    max="300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    الطول (سم)
                  </label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                    className="input-field"
                    min="100"
                    max="250"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    العمر (سنة)
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="input-field"
                    min="10"
                    max="120"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    الجنس
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
                    className="input-field"
                  >
                    <option value="male">ذكر</option>
                    <option value="female">أنثى</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 text-right">
                  مستوى النشاط
                </label>
                <div className="space-y-3">
                  {[
                    { value: 'sedentary', label: 'قليل الحركة', desc: 'لا توجد تمارين أو عمل مكتبي' },
                    { value: 'light', label: 'نشاط خفيف', desc: 'تمارين خفيفة 1-3 أيام أسبوعياً' },
                    { value: 'moderate', label: 'نشاط متوسط', desc: 'تمارين متوسطة 3-5 أيام أسبوعياً' },
                    { value: 'heavy', label: 'نشاط عالي', desc: 'تمارين شاقة 6-7 أيام أسبوعياً' },
                    { value: 'athlete', label: 'رياضي محترف', desc: 'تمارين مكثفة يومية + عمل بدني' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center p-4 rounded-xl cursor-pointer transition-all ${
                        formData.activityLevel === option.value
                          ? 'bg-emerald-50 border-2 border-emerald-500'
                          : 'bg-gray-50 border-2 border-gray-200 hover:border-emerald-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="activityLevel"
                        value={option.value}
                        checked={formData.activityLevel === option.value}
                        onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value as any })}
                        className="ml-3 w-5 h-5 text-emerald-600"
                      />
                      <div className="flex-1 text-right">
                        <p className="font-semibold text-luxury-black">{option.label}</p>
                        <p className="text-sm text-gray-600">{option.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={handleCalculateGoals}
                disabled={calculating}
                className="w-full btn-primary disabled:opacity-50"
              >
                {calculating ? (
                  <span className="flex items-center justify-center">
                    <div className="spinner w-5 h-5 ml-2"></div>
                    جاري الحساب...
                  </span>
                ) : (
                  '🧮 حساب الأهداف'
                )}
              </button>
            </div>
          ) : goals ? (
            /* Display Current Goals */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-emerald-50 rounded-2xl">
                <p className="text-gray-700 font-medium mb-2">السعرات اليومية</p>
                <p className="text-3xl font-bold text-emerald-600">
                  {formatCalories(goals.calories)} سعرة
                </p>
              </div>

              <div className="p-6 bg-red-50 rounded-2xl">
                <p className="text-gray-700 font-medium mb-2">البروتين</p>
                <p className="text-3xl font-bold text-red-600">
                  {formatMacros(goals.protein)} جم
                </p>
              </div>

              <div className="p-6 bg-yellow-50 rounded-2xl">
                <p className="text-gray-700 font-medium mb-2">الكربوهيدرات</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {formatMacros(goals.carbs)} جم
                </p>
              </div>

              <div className="p-6 bg-blue-50 rounded-2xl">
                <p className="text-gray-700 font-medium mb-2">الدهون</p>
                <p className="text-3xl font-bold text-blue-600">
                  {formatMacros(goals.fats)} جم
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🎯</div>
              <p className="text-gray-600 mb-4">لم يتم تحديد الأهداف بعد</p>
              <button onClick={() => setShowEditGoals(true)} className="btn-primary">
                حساب أهدافي
              </button>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full btn-secondary"
          >
            العودة إلى الرئيسية
          </button>
        </div>
      </div>
    </Layout>
  );
}
