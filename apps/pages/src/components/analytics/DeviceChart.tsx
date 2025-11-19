'use client';

interface DeviceChartProps {
  data: Array<{
    device: string;
    browser: string;
    count: number;
  }>;
  loading: boolean;
}

export function DeviceChart({ data, loading }: DeviceChartProps) {
  if (loading) {
    return <div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        No device data available
      </div>
    );
  }

  // Aggregate by device
  const deviceCounts = data.reduce((acc, item) => {
    const device = item.device || 'Unknown';
    acc[device] = (acc[device] || 0) + item.count;
    return acc;
  }, {} as Record<string, number>);

  const total = Object.values(deviceCounts).reduce((sum, count) => sum + count, 0);
  const devices = Object.entries(deviceCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const colors = ['bg-purple-500', 'bg-blue-500', 'bg-emerald-500', 'bg-orange-500', 'bg-pink-500'];

  return (
    <div className="space-y-6">
      {/* Pie chart (simplified as stacked bar) */}
      <div className="flex w-full h-8 rounded-lg overflow-hidden">
        {devices.map(([device, count], index) => {
          const percentage = (count / total) * 100;
          return (
            <div
              key={device}
              className={`${colors[index]} transition-all hover:opacity-80 cursor-pointer relative group`}
              style={{ width: `${percentage}%` }}
              title={`${device}: ${percentage.toFixed(1)}%`}
            >
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                {device}: {percentage.toFixed(1)}%
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {devices.map(([device, count], index) => {
          const percentage = (count / total) * 100;
          return (
            <div key={device} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 ${colors[index]} rounded`}></div>
                <span className="font-medium text-gray-700">{device}</span>
              </div>
              <span className="text-gray-500">
                {count} ({percentage.toFixed(1)}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
