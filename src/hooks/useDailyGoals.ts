import { useEffect, useState } from 'react';
import { getDailyGoals } from '@/services/database';
import { DailyGoals } from '@/types/database';

export const useDailyGoals = () => {
  const [goals, setGoals] = useState<DailyGoals | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDailyGoals();
      setGoals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch goals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return { goals, loading, error, refetch: fetchGoals };
};
