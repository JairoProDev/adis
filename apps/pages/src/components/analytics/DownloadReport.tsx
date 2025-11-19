'use client';

import { Download } from 'lucide-react';

interface DownloadReportProps {
  businessId: string;
  dateRange: {
    startDate: string;
    endDate: string;
    interval: 'day' | 'week' | 'month';
  };
  data: any;
}

export function DownloadReport({ businessId, dateRange, data }: DownloadReportProps) {
  const handleDownloadCSV = () => {
    if (!data.timeSeries || data.timeSeries.length === 0) {
      alert('No data available to export');
      return;
    }

    // Create CSV content
    const headers = ['Date', 'Views', 'Clicks', 'Visitors'];
    const rows = data.timeSeries.map((item: any) => [
      item.date,
      item.views,
      item.clicks,
      item.visitors,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row: any[]) => row.join(',')),
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `analytics-${businessId}-${dateRange.startDate}-${dateRange.endDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadJSON = () => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `analytics-${businessId}-${dateRange.startDate}-${dateRange.endDate}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleDownloadCSV}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Download className="w-4 h-4" />
        Export CSV
      </button>
      <button
        onClick={handleDownloadJSON}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Download className="w-4 h-4" />
        Export JSON
      </button>
    </div>
  );
}
