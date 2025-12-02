import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { getMealById, updateMeal, deleteMeal } from '@/services/database';
import { Meal, MEAL_TYPES } from '@/types/database';
import { formatCalories, formatMacros, formatDateTime } from '@/utils/formatters';
import toast from 'react-hot-toast';

export default function MealDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, loading: authLoading } = useAuth();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (id && typeof id === 'string') {
      fetchMeal(id);
    }
  }, [id]);

  const fetchMeal = async (mealId: string) => {
    try {
      const data = await getMealById(mealId);
      if (data) {
        setMeal(data);
        setFormData({
          name: data.name,
          calories: data.calories,
          protein: data.protein,
          carbs: data.carbs,
          fat: data.fat,
        });
      }
    } catch (error) {
      toast.error('فشل تحميل تفاصيل الوجبة');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!meal) return;

    try {
      await updateMeal(meal.id, formData);
      toast.success('تم تحديث الوجبة بنجاح');
      setEditing(false);
      fetchMeal(meal.id);
    } catch (error) {
      toast.error('فشل تحديث الوجبة');
    }
  };

  const handleDelete = async () => {
    if (!meal) return;
    if (!confirm('هل أنت متأكد من حذف هذه الوجبة؟')) return;

    try {
      await deleteMeal(meal.id);
      toast.success('تم حذف الوجبة بنجاح');
      router.push('/dashboard');
    } catch (error) {
      toast.error('فشل حذف الوجبة');
    }
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  if (!meal) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-600">الوجبة غير موجودة</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center text-emerald-600 hover:text-emerald-700 mb-6 font-medium"
        >
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          العودة إلى الرئيسية
        </button>

        <div className="card animate-fade-in">
          {meal.image_url && (
            <img
              src={meal.image_url}
              alt={meal.name}
              className="w-full h-96 object-cover rounded-2xl mb-6"
            />
          )}

          <div className="flex justify-between items-start mb-6">
            <div>
              {editing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field text-2xl font-bold"
                />
              ) : (
                <h1 className="text-3xl font-bold text-luxury-black mb-2">{meal.name}</h1>
              )}
              <p className="text-gray-600">{formatDateTime(meal.created_at)}</p>
              <span className="inline-block mt-2 px-4 py-2 bg-purple-100 text-purple-600 rounded-xl font-medium">
                {MEAL_TYPES[meal.meal_type]}
              </span>
            </div>

            <div className="flex gap-2">
              {editing ? (
                <>
                  <button onClick={handleUpdate} className="btn-primary">
                    حفظ
                  </button>
                  <button onClick={() => setEditing(false)} className="btn-secondary">
                    إلغاء
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setEditing(true)} className="btn-secondary">
                    تعديل
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                  >
                    حذف
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-emerald-50 rounded-2xl">
              <p className="text-gray-700 font-medium mb-2">السعرات الحرارية</p>
              {editing ? (
                <input
                  type="number"
                  value={formData.calories}
                  onChange={(e) => setFormData({ ...formData, calories: Number(e.target.value) })}
                  className="input-field"
                />
              ) : (
                <p className="text-3xl font-bold text-emerald-600">
                  {formatCalories(meal.calories)} سعرة
                </p>
              )}
            </div>

            <div className="p-6 bg-red-50 rounded-2xl">
              <p className="text-gray-700 font-medium mb-2">البروتين</p>
              {editing ? (
                <input
                  type="number"
                  value={formData.protein}
                  onChange={(e) => setFormData({ ...formData, protein: Number(e.target.value) })}
                  className="input-field"
                />
              ) : (
                <p className="text-3xl font-bold text-red-600">{formatMacros(meal.protein)} جم</p>
              )}
            </div>

            <div className="p-6 bg-yellow-50 rounded-2xl">
              <p className="text-gray-700 font-medium mb-2">الكربوهيدرات</p>
              {editing ? (
                <input
                  type="number"
                  value={formData.carbs}
                  onChange={(e) => setFormData({ ...formData, carbs: Number(e.target.value) })}
                  className="input-field"
                />
              ) : (
                <p className="text-3xl font-bold text-yellow-600">{formatMacros(meal.carbs)} جم</p>
              )}
            </div>

            <div className="p-6 bg-blue-50 rounded-2xl">
              <p className="text-gray-700 font-medium mb-2">الدهون</p>
              {editing ? (
                <input
                  type="number"
                  value={formData.fat}
                  onChange={(e) => setFormData({ ...formData, fat: Number(e.target.value) })}
                  className="input-field"
                />
              ) : (
                <p className="text-3xl font-bold text-blue-600">{formatMacros(meal.fat)} جم</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
