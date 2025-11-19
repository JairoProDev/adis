'use client';

import { TrendingUp, Eye, MousePointerClick } from 'lucide-react';

interface TopListingsTableProps {
  data: Array<{
    id: string;
    title: string;
    type: string;
    views: number;
    clicks: number;
    conversionRate: number;
  }>;
  loading: boolean;
}

export function TopListingsTable({ data, loading }: TopListingsTableProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        No listings data available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 text-left">
            <th className="pb-3 text-sm font-semibold text-gray-600">Rank</th>
            <th className="pb-3 text-sm font-semibold text-gray-600">Title</th>
            <th className="pb-3 text-sm font-semibold text-gray-600">Type</th>
            <th className="pb-3 text-sm font-semibold text-gray-600 text-right">Views</th>
            <th className="pb-3 text-sm font-semibold text-gray-600 text-right">Clicks</th>
            <th className="pb-3 text-sm font-semibold text-gray-600 text-right">Conv. Rate</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="py-4 text-sm">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-semibold">
                  {index + 1}
                </div>
              </td>
              <td className="py-4">
                <span className="text-sm font-medium text-gray-900">{item.title}</span>
              </td>
              <td className="py-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 capitalize">
                  {item.type}
                </span>
              </td>
              <td className="py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Eye className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{item.views.toLocaleString()}</span>
                </div>
              </td>
              <td className="py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <MousePointerClick className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{item.clicks.toLocaleString()}</span>
                </div>
              </td>
              <td className="py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-semibold text-gray-900">
                    {item.conversionRate.toFixed(1)}%
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
