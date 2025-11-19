'use client';

interface ReferrerChartProps {
  data: Array<{
    referrer: string;
    count: number;
  }>;
  loading: boolean;
}

export function ReferrerChart({ data, loading }: ReferrerChartProps) {
  if (loading) {
    return <div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        No referrer data available
      </div>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count));

  return (
    <div className="space-y-3">
      {data.map((referrer, index) => {
        const percentage = (referrer.count / maxCount) * 100;
        const displayName = formatReferrer(referrer.referrer);

        return (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700 truncate max-w-xs" title={referrer.referrer}>
                {displayName}
              </span>
              <span className="text-gray-500">{referrer.count}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function formatReferrer(url: string): string {
  if (!url || url === 'Direct') return 'Direct Traffic';
  try {
    const hostname = new URL(url).hostname.replace('www.', '');
    return hostname;
  } catch {
    return url;
  }
}
