import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { DashboardSkeleton } from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';
import { useAuth } from '@/hooks/useAuth';
import { useTodayMeals } from '@/hooks/useMeals';
import { useDailyGoals } from '@/hooks/useDailyGoals';
import { formatCalories, formatMacros, formatTime } from '@/utils/formatters';
import { MEAL_TYPES_AR } from '@/constants';
import { MEAL_TYPES } from '@/types/database';
import { deleteMeal } from '@/services/database';
import toast from 'react-hot-toast';
import { Button, Card, PageContainer, InputField, MealCard } from '@/components/ui';

type FilterType = 'all' | 'today' | 'week' | 'month';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { meals, totals, loading: mealsLoading, refetch } = useTodayMeals();
  const { goals, loading: goalsLoading } = useDailyGoals();
  const [filterType, setFilterType] = useState<FilterType>('today');
  const [searchQuery, setSearchQuery] = useState('');

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

  const filterMeals = useMemo(() => {
    let filtered = meals;

    // Filter by date
    const now = new Date();
    const filterDate = new Date(now);

    if (filterType === 'week') {
      filterDate.setDate(filterDate.getDate() - 7);
    } else if (filterType === 'month') {
      filterDate.setMonth(filterDate.getMonth() - 1);
    }

    if (filterType !== 'all') {
      filtered = filtered.filter((meal) => new Date(meal.created_at) >= filterDate);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((meal) =>
        meal.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [meals, filterType, searchQuery]);

  // Group meals by type
  const groupedMeals = filterMeals.reduce((acc, meal) => {
    if (!acc[meal.meal_type]) {
      acc[meal.meal_type] = [];
    }
    acc[meal.meal_type].push(meal);
    return acc;
  }, {} as Record<string, typeof filterMeals>);

  // Calculate streak (consecutive days with meals)
  const calculateStreak = () => {
    if (meals.length === 0) return 0;
    const uniqueDates = new Set(meals.map((m) => new Date(m.created_at).toDateString()));
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      if (uniqueDates.has(checkDate.toDateString())) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
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
  const streak = calculateStreak();

  return (
    <Layout>
      <PageContainer title="لوحة التحكم" subtitle="تتبع سعراتك وأهدافك الغذائية">
        {/* Daily Summary Card */}
        <div className="mb-8 animate-fade-in">
          <Card className="bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 text-white">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-3xl font-bold">السعرات اليومية</h2>
                <p className="text-emerald-100 mt-1">جدول طعامك اليوم</p>
              </div>
              <div className="text-6xl">🔥</div>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline mb-3">
                <span className="text-6xl font-bold">{formatCalories(totals.calories)}</span>
                {caloriesGoal > 0 && (
                  <span className="text-2xl ml-3 opacity-80">/ {formatCalories(caloriesGoal)}</span>
                )}
              </div>

              {caloriesGoal > 0 && (
                <>
                  <div className="w-full bg-white/25 rounded-full h-3 mb-4">
                    <div
                      className="bg-gradient-to-r from-yellow-300 to-yellow-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(caloriesProgress, 100)}%` }}
                    ></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="opacity-80">متبقي</p>
                      <p className="font-bold text-lg">{formatCalories(Math.max(remaining, 0))}</p>
                    </div>
                    <div>
                      <p className="opacity-80">نسبة التقدم</p>
                      <p className="font-bold text-lg">{Math.round(caloriesProgress)}%</p>
                    </div>
                    <div>
                      <p className="opacity-80">السلسلة</p>
                      <p className="font-bold text-lg">{streak} 🔥</p>
                    </div>
                  </div>
                </>
              )}
              {caloriesGoal === 0 && (
                <p className="text-lg opacity-90">لم يتم تحديد الأهداف بعد</p>
              )}
            </div>
          </Card>
        </div>

        {/* Macros Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 animate-fade-in">
          {/* Protein */}
          <Card>
            <div className="flex items-center gap-4">
              <div className="text-4xl">💪</div>
              <div className="flex-1">
                <p className="text-gray-600 dark:text-gray-400 text-sm">البروتين</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {formatMacros(totals.protein)}
                  </p>
                  {proteinGoal > 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">/ {formatMacros(proteinGoal)} جم</p>
                  )}
                </div>
              </div>
            </div>
            {proteinGoal > 0 && (
              <div className="mt-3 bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min((totals.protein / proteinGoal) * 100, 100)}%` }}
                />
              </div>
            )}
          </Card>

          {/* Carbs */}
          <Card>
            <div className="flex items-center gap-4">
              <div className="text-4xl">🌾</div>
              <div className="flex-1">
                <p className="text-gray-600 dark:text-gray-400 text-sm">الكربوهيدرات</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                    {formatMacros(totals.carbs)}
                  </p>
                  {carbsGoal > 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">/ {formatMacros(carbsGoal)} جم</p>
                  )}
                </div>
              </div>
            </div>
            {carbsGoal > 0 && (
              <div className="mt-3 bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min((totals.carbs / carbsGoal) * 100, 100)}%` }}
                />
              </div>
            )}
          </Card>

          {/* Fats */}
          <Card>
            <div className="flex items-center gap-4">
              <div className="text-4xl">💧</div>
              <div className="flex-1">
                <p className="text-gray-600 dark:text-gray-400 text-sm">الدهون</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {formatMacros(totals.fat)}
                  </p>
                  {fatsGoal > 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">/ {formatMacros(fatsGoal)} جم</p>
                  )}
                </div>
              </div>
            </div>
            {fatsGoal > 0 && (
              <div className="mt-3 bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min((totals.fat / fatsGoal) * 100, 100)}%` }}
                />
              </div>
            )}
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-8 flex-col sm:flex-row">
          <Button
            onClick={() => router.push('/scan')}
            variant="primary"
            size="lg"
            fullWidth
          >
            📸 تحليل وجبة جديدة
          </Button>
          <Button
            onClick={() => router.push('/profile')}
            variant="secondary"
            size="lg"
            fullWidth
          >
            ⚙️ تحديث الأهداف
          </Button>
        </div>

        {/* Filter and Search */}
        <Card className="mb-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">البحث والتصفية</h3>

            {/* Search Box */}
            <InputField
              placeholder="ابحث عن وجبة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* Filter Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['today', 'week', 'month', 'all'] as FilterType[]).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setFilterType(filter)}
                  className={`py-2 px-4 rounded-xl font-semibold transition-all ${
                    filterType === filter
                      ? 'bg-emerald-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {filter === 'today'
                    ? 'اليوم'
                    : filter === 'week'
                    ? 'هذا الأسبوع'
                    : filter === 'month'
                    ? 'هذا الشهر'
                    : 'الكل'}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Meals List */}
        {filterMeals.length === 0 ? (
          <EmptyState
            message={
              searchQuery
                ? `لم يتم العثور على وجبات تطابق "${searchQuery}"`
                : 'لم تقم بإضافة أي وجبات'
            }
            action={{
              label: 'إضافة وجبة',
              onClick: () => router.push('/scan'),
            }}
          />
        ) : (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">الوجبات</h2>

            {Object.entries(groupedMeals).map(([type, typeMeals]) => (
              <div key={type} className="space-y-4">
                <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <span className="text-2xl">
                    {type === 'breakfast'
                      ? '🌅'
                      : type === 'lunch'
                      ? '🍽️'
                      : type === 'dinner'
                      ? '🌙'
                      : '🍪'}
                  </span>
                  {MEAL_TYPES_AR[type as keyof typeof MEAL_TYPES_AR]}
                </h3>
                <div className="space-y-3">
                  {typeMeals.map((meal) => (
                    <MealCard
                      key={meal.id}
                      id={meal.id}
                      name={meal.name}
                      calories={meal.calories}
                      protein={meal.protein}
                      carbs={meal.carbs}
                      fat={meal.fat}
                      mealType={meal.meal_type}
                      mealTypeLabel={MEAL_TYPES[meal.meal_type as keyof typeof MEAL_TYPES]}
                      imageUrl={meal.image_url}
                      createdAt={meal.created_at}
                      onDelete={() => handleDeleteMeal(meal.id)}
                      onView={() => router.push(`/meals/${meal.id}`)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </PageContainer>
    </Layout>
  );
}
