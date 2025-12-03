import React from 'react';

interface MacroRowProps {
  label: string;
  value: number;
  unit: string;
  goal?: number;
  color: string;
  icon?: string;
}

export default function MacroRow({
  label,
  value,
  unit,
  goal,
  color,
  icon,
}: MacroRowProps) {
  const percentage = goal && goal > 0 ? (value / goal) * 100 : 0;

  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          {icon && <span className="text-2xl">{icon}</span>}
          <span className="text-gray-700 dark:text-gray-300 font-medium">{label}</span>
        </div>
        {goal && (
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 bg-${color}-500`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        )}
      </div>
      <div className="text-right ml-4">
        <p className={`text-2xl font-bold text-${color}-600 dark:text-${color}-400`}>
          {value}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {unit}
          {goal && ` / ${goal}`}
        </p>
      </div>
    </div>
  );
}
