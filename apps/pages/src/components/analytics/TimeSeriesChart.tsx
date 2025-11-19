'use client';

interface TimeSeriesChartProps {
  data: Array<{
    date: string;
    views: number;
    clicks: number;
    visitors: number;
  }>;
  loading: boolean;
}

export function TimeSeriesChart({ data, loading }: TimeSeriesChartProps) {
  if (loading) {
    return <div className="h-80 bg-gray-100 animate-pulse rounded-lg"></div>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-400">
        No data available for the selected period
      </div>
    );
  }

  // Find max value for scaling
  const maxValue = Math.max(...data.map((d) => Math.max(d.views, d.clicks, d.visitors)));
  const getHeight = (value: number) => (value / maxValue) * 100;

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-500 rounded"></div>
          <span className="text-gray-600">Views</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-gray-600">Clicks</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-500 rounded"></div>
          <span className="text-gray-600">Visitors</span>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-64">
        <div className="absolute inset-0 flex items-end justify-between gap-1">
          {data.map((point, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-1">
              {/* Bars */}
              <div className="w-full flex items-end justify-center gap-0.5 h-full">
                <div
                  className="flex-1 bg-emerald-500 rounded-t hover:bg-emerald-600 transition-all cursor-pointer relative group"
                  style={{ height: `${getHeight(point.views)}%` }}
                  title={`${point.views} views`}
                >
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {point.views} views
                  </div>
                </div>
                <div
                  className="flex-1 bg-blue-500 rounded-t hover:bg-blue-600 transition-all cursor-pointer relative group"
                  style={{ height: `${getHeight(point.clicks)}%` }}
                  title={`${point.clicks} clicks`}
                >
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {point.clicks} clicks
                  </div>
                </div>
                <div
                  className="flex-1 bg-purple-500 rounded-t hover:bg-purple-600 transition-all cursor-pointer relative group"
                  style={{ height: `${getHeight(point.visitors)}%` }}
                  title={`${point.visitors} visitors`}
                >
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {point.visitors} visitors
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        {data.map((point, index) => {
          // Show only every nth label to avoid crowding
          const showLabel = data.length <= 10 || index % Math.ceil(data.length / 10) === 0;
          return (
            <div key={index} className="flex-1 text-center">
              {showLabel && formatDate(point.date)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
