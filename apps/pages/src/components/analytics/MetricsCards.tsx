'use client';

import { Eye, MousePointerClick, Users, TrendingUp, Clock, Activity } from 'lucide-react';

interface MetricsCardsProps {
  summary: {
    totalViews: number;
    totalClicks: number;
    uniqueVisitors: number;
    conversionRate: number;
    avgSessionDuration: number;
    bounceRate: number;
  };
  loading: boolean;
}

export function MetricsCards({ summary, loading }: MetricsCardsProps) {
  const metrics = [
    {
      label: 'Total Views',
      value: summary.totalViews.toLocaleString(),
      icon: Eye,
      color: 'emerald',
      change: '+12.5%',
    },
    {
      label: 'Total Clicks',
      value: summary.totalClicks.toLocaleString(),
      icon: MousePointerClick,
      color: 'blue',
      change: '+8.2%',
    },
    {
      label: 'Unique Visitors',
      value: summary.uniqueVisitors.toLocaleString(),
      icon: Users,
      color: 'purple',
      change: '+15.3%',
    },
    {
      label: 'Conversion Rate',
      value: `${summary.conversionRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'pink',
      change: '+3.1%',
    },
    {
      label: 'Avg. Session',
      value: formatDuration(summary.avgSessionDuration),
      icon: Clock,
      color: 'orange',
      change: '+5 sec',
    },
    {
      label: 'Bounce Rate',
      value: `${summary.bounceRate.toFixed(1)}%`,
      icon: Activity,
      color: 'red',
      change: '-2.5%',
      isNegativeGood: true,
    },
  ];

  const colorClasses: Record<string, string> = {
    emerald: 'bg-emerald-100 text-emerald-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    pink: 'bg-pink-100 text-pink-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        const isPositive = metric.change.startsWith('+');
        const showPositive = metric.isNegativeGood ? !isPositive : isPositive;

        return (
          <div
            key={metric.label}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${colorClasses[metric.color]}`}>
                <Icon className="w-6 h-6" />
              </div>
              <span
                className={`text-sm font-medium px-2 py-1 rounded ${
                  showPositive
                    ? 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-600'
                }`}
              >
                {metric.change}
              </span>
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-bold text-gray-900">{metric.value}</h3>
              <p className="text-sm text-gray-500">{metric.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return `${minutes}m ${remainingSeconds}s`;
}
