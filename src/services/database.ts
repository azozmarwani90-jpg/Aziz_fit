import { supabase, getCurrentUser } from './supabase';
import { Meal, DailyGoals, UserProfile, WeightEntry, AiLog } from '@/types/database';

// MEALS
export const getMealsForDay = async (date: Date): Promise<Meal[]> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('user_id', user.id)
    .gte('created_at', startOfDay.toISOString())
    .lte('created_at', endOfDay.toISOString())
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getMealById = async (id: string): Promise<Meal | null> => {
  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const insertMeal = async (meal: Omit<Meal, 'id' | 'user_id' | 'created_at' | 'ai_log_id'>): Promise<Meal> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  // Prepare meal data - only include fields that exist in the database schema
  const mealData = {
    name: meal.name,
    calories: meal.calories,
    protein: meal.protein,
    carbs: meal.carbs,
    fat: meal.fat,
    meal_type: meal.meal_type,
    image_url: meal.image_url || null,
    user_id: user.id,
  };

  console.log('Saving meal:', JSON.stringify(mealData, null, 2));

  const { data, error } = await supabase
    .from('meals')
    .insert([mealData])
    .select()
    .single();

  if (error) {
    console.error('Supabase insert error:', JSON.stringify(error, null, 2));
    throw error;
  }
  
  console.log('Meal saved successfully:', data?.id);
  return data;
};

export const updateMeal = async (id: string, updates: Partial<Meal>): Promise<Meal> => {
  const { data, error } = await supabase
    .from('meals')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteMeal = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('meals')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// DAILY GOALS
export const getDailyGoals = async (): Promise<DailyGoals | null> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('daily_goals')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const updateDailyGoals = async (
  weight: number,
  height: number,
  age: number,
  gender: 'male' | 'female',
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'heavy' | 'athlete'
): Promise<DailyGoals> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  // Calculate BMI
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);

  // Calculate BMR using Mifflin-St Jeor Equation
  let bmr: number;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // Activity factors
  const activityFactors = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    heavy: 1.7,
    athlete: 1.9,
  };

  // Calculate TDEE
  const tdee = bmr * activityFactors[activityLevel];
  const calories = Math.round(tdee);

  // Calculate macros (25% protein, 50% carbs, 25% fats)
  const protein = Math.round((calories * 0.25) / 4);
  const carbs = Math.round((calories * 0.5) / 4);
  const fats = Math.round((calories * 0.25) / 9);

  const { data, error } = await supabase
    .from('daily_goals')
    .upsert({
      user_id: user.id,
      calories,
      protein,
      carbs,
      fats,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// USER PROFILE
export const getUserProfile = async (): Promise<UserProfile | null> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) throw error;
  return data;
};

// WEIGHT ENTRIES
export const getWeightEntries = async (): Promise<WeightEntry[]> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('weight_entries')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
};

// AI LOGS
export const getAiLogs = async (): Promise<AiLog[]> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('ai_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;
  return data || [];
};

export const insertAiLog = async (
  prompt: string,
  response: string,
  imageUrl?: string
): Promise<AiLog> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('ai_logs')
    .insert({
      user_id: user.id,
      prompt,
      response,
      image_url: imageUrl,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// STORAGE
export const uploadImage = async (file: File): Promise<string> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}/${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('food_images')
    .upload(fileName, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('food_images')
    .getPublicUrl(fileName);

  return publicUrl;
};
