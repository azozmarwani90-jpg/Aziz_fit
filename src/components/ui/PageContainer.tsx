import React, { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export default function PageContainer({
  children,
  className = '',
  title,
  subtitle,
}: PageContainerProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-luxury-pearl via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 ${className}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {title && (
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
              {title}
            </h1>
            {subtitle && <p className="text-gray-600 dark:text-gray-400 text-lg">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
