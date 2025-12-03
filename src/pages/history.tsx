import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import { useAuth } from '@/hooks/useAuth';
import { getMealsForDateRange } from '@/services/database';
import { Meal } from '@/types/database';
import { formatCalories, formatMacros, formatDate, formatTime } from '@/utils/formatters';
import { MEAL_TYPES_AR } from '@/constants';
import { deleteMeal } from '@/services/database';
import toast from 'react-hot-toast';

export default function HistoryPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchMeals();
    }
  }, [selectedDate, user]);

  const fetchMeals = async () => {
    try {
      setLoading(true);
      const startDate = new Date(selectedDate);
      startDate.setDate(startDate.getDate() - 7);
      const data = await getMealsForDateRange(startDate, selectedDate);
      setMeals(data);
    } catch (error) {
      toast.error('فشل تحميل الوجبات');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMeal = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الوجبة؟')) return;

    try {
      await deleteMeal(id);
      toast.success('تم حذف الوجبة بنجاح');
      fetchMeals();
    } catch (error) {
      toast.error('فشل حذف الوجبة');
    }
  };

  const filteredMeals = meals.filter((meal) => {
    const matchesSearch = meal.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || meal.meal_type === filterType;
    return matchesSearch && matchesType;
  });

  const groupedByDate = filteredMeals.reduce((acc, meal) => {
    const date = new Date(meal.created_at).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(meal);
    return acc;
  }, {} as Record<string, Meal[]>);

  if (authLoading || loading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-luxury-black flex items-center">
            <div className="w-1 h-10 bg-gradient-primary rounded-full ml-3"></div>
            سجل الوجبات
          </h1>
        </div>

        <div className="card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                البحث
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن وجبة..."
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                نوع الوجبة
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="input-field"
              >
                <option value="all">الكل</option>
                <option value="breakfast">فطور</option>
                <option value="lunch">غداء</option>
                <option value="dinner">عشاء</option>
                <option value="snack">وجبة خفيفة</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                التاريخ
              </label>
              <input
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {filteredMeals.length === 0 ? (
          <EmptyState
            message="لا توجد وجبات مطابقة للبحث"
            action={{
              label: 'إضافة وجبة',
              onClick: () => router.push('/scan'),
            }}
          />
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedByDate).map(([date, dateMeals]) => (
              <div key={date}>
                <h2 className="text-xl font-bold text-gray-700 mb-4">
                  {formatDate(new Date(date))}
                </h2>
                <div className="space-y-4">
                  {dateMeals.map((meal) => (
                    <div
                      key={meal.id}
                      className="card hover:shadow-premium cursor-pointer transition-all"
                      onClick={() => router.push(`/meals/${meal.id}`)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1">
                          {meal.image_url ? (
                            <img
                              src={meal.image_url}
                              alt={meal.name}
                              className="w-20 h-20 rounded-2xl object-cover ml-4"
                            />
                          ) : (
                            <div className="w-20 h-20 rounded-2xl bg-emerald-100 flex items-center justify-center ml-4">
                              <span className="text-3xl">🍽️</span>
                            </div>
                          )}
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-luxury-black mb-1">
                              {meal.name}
                            </h4>
                            <div className="flex gap-2 mb-2">
                              <span className="inline-block bg-gradient-primary text-white px-3 py-1 rounded-lg text-sm font-medium">
                                {formatCalories(meal.calories)} سعرة
                              </span>
                              <span className="inline-block bg-purple-100 text-purple-600 px-3 py-1 rounded-lg text-sm font-medium">
                                {MEAL_TYPES_AR[meal.meal_type as keyof typeof MEAL_TYPES_AR]}
                              </span>
                            </div>
                            <div className="flex gap-4 text-sm text-gray-600">
                              <span>بروتين: {formatMacros(meal.protein)}جم</span>
                              <span>كارب: {formatMacros(meal.carbs)}جم</span>
                              <span>دهون: {formatMacros(meal.fat)}جم</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{formatTime(meal.created_at)}</p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMeal(meal.id);
                          }}
                          className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
