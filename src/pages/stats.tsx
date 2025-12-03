import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { getMealsForDateRange } from '@/services/database';
import { Meal } from '@/types/database';
import { formatCalories, formatMacros, formatDate } from '@/utils/formatters';

interface DayStats {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meals: number;
}

export default function StatsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'week' | 'month'>('week');
  const [stats, setStats] = useState<DayStats[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [period, user]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const endDate = new Date();
      const startDate = new Date();

      if (period === 'week') {
        startDate.setDate(startDate.getDate() - 7);
      } else {
        startDate.setDate(startDate.getDate() - 30);
      }

      const meals = await getMealsForDateRange(startDate, endDate);

      const dayMap = new Map<string, DayStats>();

      meals.forEach((meal) => {
        const date = new Date(meal.created_at).toDateString();
        const existing = dayMap.get(date) || {
          date,
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          meals: 0,
        };

        dayMap.set(date, {
          date,
          calories: existing.calories + meal.calories,
          protein: existing.protein + meal.protein,
          carbs: existing.carbs + meal.carbs,
          fat: existing.fat + meal.fat,
          meals: existing.meals + 1,
        });
      });

      const statsArray = Array.from(dayMap.values()).sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setStats(statsArray);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  const totalCalories = stats.reduce((sum, day) => sum + day.calories, 0);
  const totalProtein = stats.reduce((sum, day) => sum + day.protein, 0);
  const totalCarbs = stats.reduce((sum, day) => sum + day.carbs, 0);
  const totalFat = stats.reduce((sum, day) => sum + day.fat, 0);
  const totalMeals = stats.reduce((sum, day) => sum + day.meals, 0);
  const avgCaloriesPerDay = stats.length > 0 ? Math.round(totalCalories / stats.length) : 0;

  const maxCalories = Math.max(...stats.map(s => s.calories), 1);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-luxury-black flex items-center">
            <div className="w-1 h-10 bg-gradient-primary rounded-full ml-3"></div>
            الإحصائيات
          </h1>

          <div className="flex gap-2">
            <button
              onClick={() => setPeriod('week')}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                period === 'week'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              أسبوع
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                period === 'month'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              شهر
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card bg-gradient-primary text-white">
            <div className="text-5xl mb-2">🔥</div>
            <p className="text-sm opacity-80 mb-1">إجمالي السعرات</p>
            <p className="text-3xl font-bold">{formatCalories(totalCalories)}</p>
          </div>

          <div className="card bg-red-50">
            <div className="text-4xl mb-2">💪</div>
            <p className="text-sm text-gray-600 mb-1">إجمالي البروتين</p>
            <p className="text-3xl font-bold text-red-600">{formatMacros(totalProtein)} جم</p>
          </div>

          <div className="card bg-blue-50">
            <div className="text-4xl mb-2">🍽️</div>
            <p className="text-sm text-gray-600 mb-1">عدد الوجبات</p>
            <p className="text-3xl font-bold text-blue-600">{totalMeals}</p>
          </div>

          <div className="card bg-yellow-50">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-sm text-gray-600 mb-1">متوسط السعرات اليومي</p>
            <p className="text-3xl font-bold text-yellow-600">{formatCalories(avgCaloriesPerDay)}</p>
          </div>
        </div>

        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-luxury-black mb-6">السعرات اليومية</h2>
          <div className="space-y-4">
            {stats.map((day) => {
              const percentage = (day.calories / maxCalories) * 100;
              return (
                <div key={day.date}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {formatDate(new Date(day.date))}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{day.meals} وجبات</span>
                      <span className="text-lg font-bold text-emerald-600">
                        {formatCalories(day.calories)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-primary h-3 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold text-luxury-black mb-6">توزيع العناصر الغذائية</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-medium">البروتين</span>
                <span className="text-red-600 font-bold">{formatMacros(totalProtein)} جم</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-red-500 h-3 rounded-full"
                  style={{ width: `${(totalProtein / (totalProtein + totalCarbs + totalFat)) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-medium">الكربوهيدرات</span>
                <span className="text-yellow-600 font-bold">{formatMacros(totalCarbs)} جم</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-yellow-500 h-3 rounded-full"
                  style={{ width: `${(totalCarbs / (totalProtein + totalCarbs + totalFat)) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-medium">الدهون</span>
                <span className="text-blue-600 font-bold">{formatMacros(totalFat)} جم</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full"
                  style={{ width: `${(totalFat / (totalProtein + totalCarbs + totalFat)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
