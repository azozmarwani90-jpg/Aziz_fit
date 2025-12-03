import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { DashboardSkeleton } from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';
import { useAuth } from '@/hooks/useAuth';
import { useTodayMeals } from '@/hooks/useMeals';
import { useDailyGoals } from '@/hooks/useDailyGoals';
import { formatCalories, formatMacros, formatTime } from '@/utils/formatters';
import { MEAL_TYPES_AR } from '@/constants';
import { deleteMeal } from '@/services/database';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { meals, totals, loading: mealsLoading, refetch } = useTodayMeals();
  const { goals, loading: goalsLoading } = useDailyGoals();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleDeleteMeal = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الوجبة؟')) return;

    try {
      await deleteMeal(id);
      toast.success('تم حذف الوجبة بنجاح');
      refetch();
    } catch (error) {
      toast.error('فشل حذف الوجبة');
    }
  };

  if (authLoading || mealsLoading || goalsLoading) {
    return (
      <Layout>
        <DashboardSkeleton />
      </Layout>
    );
  }

  const caloriesGoal = goals?.calories || 0;
  const proteinGoal = goals?.protein || 0;
  const carbsGoal = goals?.carbs || 0;
  const fatsGoal = goals?.fats || 0;

  const caloriesProgress = caloriesGoal > 0 ? (totals.calories / caloriesGoal) * 100 : 0;
  const remaining = caloriesGoal - totals.calories;

  // Group meals by type
  const groupedMeals = meals.reduce((acc, meal) => {
    if (!acc[meal.meal_type]) {
      acc[meal.meal_type] = [];
    }
    acc[meal.meal_type].push(meal);
    return acc;
  }, {} as Record<string, typeof meals>);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Daily Summary Card */}
        <div className="card bg-gradient-primary text-white mb-8 animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">السعرات اليومية</h2>
            <div className="bg-white/20 p-3 rounded-2xl">
              <span className="text-3xl">🔥</span>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-baseline mb-2">
              <span className="text-5xl font-bold">{formatCalories(totals.calories)}</span>
              {caloriesGoal > 0 && (
                <span className="text-xl mr-2 opacity-80">/ {formatCalories(caloriesGoal)}</span>
              )}
            </div>

            {caloriesGoal > 0 && (
              <>
                <div className="w-full bg-white/25 rounded-full h-3 mb-3">
                  <div
                    className="bg-gradient-gold h-3 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(caloriesProgress, 100)}%` }}
                  ></div>
                </div>
                <p className="text-lg opacity-90">
                  متبقي: {formatCalories(Math.max(remaining, 0))} سعرة
                </p>
              </>
            )}
            {caloriesGoal === 0 && (
              <p className="text-lg opacity-90">لم يتم تحديد الأهداف بعد</p>
            )}
          </div>
        </div>

        {/* Macros Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Protein */}
          <div className="card animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-red-100 p-3 rounded-2xl">
                <span className="text-2xl">💪</span>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-luxury-black">
                  {formatMacros(totals.protein)}
                </p>
                {proteinGoal > 0 && (
                  <p className="text-sm text-gray-600">/ {formatMacros(proteinGoal)} جم</p>
                )}
              </div>
            </div>
            <p className="text-gray-600 font-medium">البروتين</p>
          </div>

          {/* Carbs */}
          <div className="card animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gold/20 p-3 rounded-2xl">
                <span className="text-2xl">🌾</span>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-luxury-black">
                  {formatMacros(totals.carbs)}
                </p>
                {carbsGoal > 0 && (
                  <p className="text-sm text-gray-600">/ {formatMacros(carbsGoal)} جم</p>
                )}
              </div>
            </div>
            <p className="text-gray-600 font-medium">الكربوهيدرات</p>
          </div>

          {/* Fats */}
          <div className="card animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-2xl">
                <span className="text-2xl">💧</span>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-luxury-black">
                  {formatMacros(totals.fat)}
                </p>
                {fatsGoal > 0 && (
                  <p className="text-sm text-gray-600">/ {formatMacros(fatsGoal)} جم</p>
                )}
              </div>
            </div>
            <p className="text-gray-600 font-medium">الدهون</p>
          </div>
        </div>

        {/* Scan Button */}
        <div className="text-center mb-8">
          <button
            onClick={() => router.push('/scan')}
            className="btn-primary text-lg px-8 py-4"
          >
            <span className="text-2xl ml-2">📸</span>
            تحليل وجبة جديدة
          </button>
        </div>

        {/* Meals List */}
        {meals.length === 0 ? (
          <EmptyState
            message="لم تقم بإضافة أي وجبات اليوم"
            action={{
              label: 'إضافة وجبة',
              onClick: () => router.push('/scan'),
            }}
          />
        ) : (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-luxury-black flex items-center">
              <div className="w-1 h-8 bg-gradient-primary rounded-full ml-3"></div>
              الوجبات
            </h2>

            {Object.entries(groupedMeals).map(([type, typeMeals]) => (
              <div key={type} className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-700">
                  {MEAL_TYPES_AR[type as keyof typeof MEAL_TYPES_AR]}
                </h3>
                {typeMeals.map((meal) => (
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
                          <div className="inline-block bg-gradient-primary text-white px-3 py-1 rounded-lg text-sm font-medium mb-1">
                            {formatCalories(meal.calories)} سعرة
                          </div>
                          <p className="text-sm text-gray-500">{formatTime(meal.created_at)}</p>
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
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
