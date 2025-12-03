import React from 'react';
import Card from './Card';
import Button from './Button';

interface MealCardProps {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: string;
  mealTypeLabel: string;
  imageUrl?: string;
  createdAt: string;
  onDelete?: () => void;
  onView?: () => void;
}

export default function MealCard({
  id,
  name,
  calories,
  protein,
  carbs,
  fat,
  mealType,
  mealTypeLabel,
  imageUrl,
  createdAt,
  onDelete,
  onView,
}: MealCardProps) {
  const createdAtDate = new Date(createdAt);
  const timeString = createdAtDate.toLocaleTimeString('ar-SA', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const mealTypeColors: Record<string, string> = {
    breakfast: 'from-orange-400 to-orange-600',
    lunch: 'from-emerald-400 to-emerald-600',
    dinner: 'from-purple-400 to-purple-600',
    snack: 'from-pink-400 to-pink-600',
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col sm:flex-row gap-4">
        {imageUrl && (
          <div className="w-full sm:w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            />
          </div>
        )}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{timeString}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-white text-xs font-semibold bg-gradient-to-r ${
                mealTypeColors[mealType] || mealTypeColors.snack
              }`}
            >
              {mealTypeLabel}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="text-center p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
              <p className="text-xs text-gray-600 dark:text-gray-400">سعرات</p>
              <p className="font-bold text-emerald-600 dark:text-emerald-400">{calories}</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
              <p className="text-xs text-gray-600 dark:text-gray-400">بروتين</p>
              <p className="font-bold text-red-600 dark:text-red-400">{protein}g</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
              <p className="text-xs text-gray-600 dark:text-gray-400">كربوهيدرات</p>
              <p className="font-bold text-yellow-600 dark:text-yellow-400">{carbs}g</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <p className="text-xs text-gray-600 dark:text-gray-400">دهون</p>
              <p className="font-bold text-blue-600 dark:text-blue-400">{fat}g</p>
            </div>
          </div>

          <div className="flex gap-2">
            {onView && (
              <Button size="sm" variant="outline" onClick={onView}>
                عرض
              </Button>
            )}
            {onDelete && (
              <Button size="sm" variant="danger" onClick={onDelete}>
                حذف
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
