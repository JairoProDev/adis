'use client';

interface GeographicChartProps {
  data: Array<{
    country: string;
    city: string;
    count: number;
  }>;
  loading: boolean;
}

export function GeographicChart({ data, loading }: GeographicChartProps) {
  if (loading) {
    return <div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        No geographic data available
      </div>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count));
  const topLocations = data.slice(0, 10);

  return (
    <div className="space-y-3">
      {topLocations.map((location, index) => {
        const percentage = (location.count / maxCount) * 100;

        return (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">
                {location.city}, {location.country}
              </span>
              <span className="text-gray-500">{location.count}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
