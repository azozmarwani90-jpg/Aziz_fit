export const MealCardSkeleton = () => (
  <div className="card animate-pulse">
    <div className="flex items-center">
      <div className="w-20 h-20 bg-gray-200 rounded-2xl ml-4"></div>
      <div className="flex-1">
        <div className="h-5 bg-gray-200 rounded-lg w-2/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded-lg w-1/3 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded-lg w-1/4"></div>
      </div>
    </div>
  </div>
);

export const StatCardSkeleton = () => (
  <div className="card animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
      <div className="h-8 bg-gray-200 rounded-lg w-20"></div>
    </div>
    <div className="h-4 bg-gray-200 rounded-lg w-24"></div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="card bg-gradient-primary text-white mb-8 animate-pulse">
      <div className="h-8 bg-white/20 rounded-lg w-48 mb-6"></div>
      <div className="h-12 bg-white/20 rounded-lg w-64 mb-4"></div>
      <div className="h-3 bg-white/20 rounded-full w-full mb-3"></div>
      <div className="h-5 bg-white/20 rounded-lg w-40"></div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
    </div>

    <div className="space-y-4">
      <MealCardSkeleton />
      <MealCardSkeleton />
      <MealCardSkeleton />
    </div>
  </div>
);
