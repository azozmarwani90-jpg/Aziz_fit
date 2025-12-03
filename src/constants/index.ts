export const MEAL_TYPES_AR = {
  breakfast: 'فطور',
  lunch: 'غداء',
  dinner: 'عشاء',
  snack: 'وجبة خفيفة',
} as const;

export const ACTIVITY_LEVELS = {
  sedentary: {
    value: 'sedentary',
    label: 'قليل الحركة',
    description: 'لا توجد تمارين أو عمل مكتبي',
    factor: 1.2,
  },
  light: {
    value: 'light',
    label: 'نشاط خفيف',
    description: 'تمارين خفيفة 1-3 أيام أسبوعياً',
    factor: 1.375,
  },
  moderate: {
    value: 'moderate',
    label: 'نشاط متوسط',
    description: 'تمارين متوسطة 3-5 أيام أسبوعياً',
    factor: 1.55,
  },
  heavy: {
    value: 'heavy',
    label: 'نشاط عالي',
    description: 'تمارين شاقة 6-7 أيام أسبوعياً',
    factor: 1.7,
  },
  athlete: {
    value: 'athlete',
    label: 'رياضي محترف',
    description: 'تمارين مكثفة يومية + عمل بدني',
    factor: 1.9,
  },
} as const;

export const MACRO_DISTRIBUTION = {
  protein: 0.25,
  carbs: 0.50,
  fat: 0.25,
} as const;

export const CALORIES_PER_GRAM = {
  protein: 4,
  carbs: 4,
  fat: 9,
} as const;

export const API_ROUTES = {
  analyzeMeal: '/api/analyze-meal',
} as const;

export const STORAGE_BUCKETS = {
  foodImages: 'food_images',
} as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
