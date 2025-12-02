import { useEffect, useState } from 'react';
import { getMealsForDay } from '@/services/database';
import { Meal, DailyTotals } from '@/types/database';

export const useTodayMeals = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMeals = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMealsForDay(new Date());
      setMeals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch meals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const totals: DailyTotals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return { meals, totals, loading, error, refetch: fetchMeals };
};
