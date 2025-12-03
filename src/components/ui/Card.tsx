import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export default function Card({ 
  children, 
  className = '', 
  hoverable = false,
  onClick 
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white dark:bg-gray-900 rounded-3xl p-6
        shadow-md hover:shadow-lg transition-all duration-300
        border border-gray-100 dark:border-gray-800
        ${hoverable ? 'cursor-pointer hover:scale-105' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
