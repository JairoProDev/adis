'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import {
  GET_ANALYTICS_SUMMARY,
  GET_TIME_SERIES_DATA,
  GET_GEOGRAPHIC_DATA,
  GET_DEVICE_DATA,
  GET_REFERRER_DATA,
  GET_TOP_LISTINGS,
} from '@/lib/apollo/queries';
import { MetricsCards } from './MetricsCards';
import { TimeSeriesChart } from './TimeSeriesChart';
import { GeographicChart } from './GeographicChart';
import { DeviceChart } from './DeviceChart';
import { ReferrerChart } from './ReferrerChart';
import { TopListingsTable } from './TopListingsTable';
import { DateRangePicker } from './DateRangePicker';
import { DownloadReport } from './DownloadReport';
import { Calendar, TrendingUp, Users, MousePointerClick } from 'lucide-react';

interface AnalyticsDashboardProps {
  businessId: string;
}

export function AnalyticsDashboard({ businessId }: AnalyticsDashboardProps) {
  const [dateRange, setDateRange] = useState({
    startDate: getLastNDays(30),
    endDate: new Date().toISOString().split('T')[0],
    interval: 'day' as 'day' | 'week' | 'month',
  });

  const analyticsInput = {
    businessId,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    interval: dateRange.interval,
  };

  // Fetch all analytics data
  const { data: summaryData, loading: summaryLoading } = useQuery(GET_ANALYTICS_SUMMARY, {
    variables: { input: analyticsInput },
  });

  const { data: timeSeriesData, loading: timeSeriesLoading } = useQuery(GET_TIME_SERIES_DATA, {
    variables: { input: analyticsInput },
  });

  const { data: geoData, loading: geoLoading } = useQuery(GET_GEOGRAPHIC_DATA, {
    variables: { input: analyticsInput },
  });

  const { data: deviceData, loading: deviceLoading } = useQuery(GET_DEVICE_DATA, {
    variables: { input: analyticsInput },
  });

  const { data: referrerData, loading: referrerLoading } = useQuery(GET_REFERRER_DATA, {
    variables: { input: analyticsInput },
  });

  const { data: topListingsData, loading: topListingsLoading } = useQuery(GET_TOP_LISTINGS, {
    variables: { input: analyticsInput },
  });

  const isLoading =
    summaryLoading ||
    timeSeriesLoading ||
    geoLoading ||
    deviceLoading ||
    referrerLoading ||
    topListingsLoading;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-500 mt-1">Track your performance and insights</p>
          </div>
          <DownloadReport
            businessId={businessId}
            dateRange={dateRange}
            data={{
              summary: summaryData?.businessAnalyticsSummary,
              timeSeries: timeSeriesData?.businessTimeSeriesData,
              geographic: geoData?.businessGeographicData,
              devices: deviceData?.businessDeviceData,
              referrers: referrerData?.businessReferrerData,
              topListings: topListingsData?.businessTopListings,
            }}
          />
        </div>

        {/* Date Range Picker */}
        <DateRangePicker value={dateRange} onChange={setDateRange} />

        {/* Key Metrics */}
        {summaryData?.businessAnalyticsSummary && (
          <MetricsCards summary={summaryData.businessAnalyticsSummary} loading={isLoading} />
        )}

        {/* Time Series Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Views Over Time</h2>
              <p className="text-sm text-gray-500">Daily views, clicks, and visitors</p>
            </div>
          </div>
          <TimeSeriesChart
            data={timeSeriesData?.businessTimeSeriesData || []}
            loading={timeSeriesLoading}
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Geographic Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Geographic Distribution</h2>
                <p className="text-sm text-gray-500">Where your visitors are from</p>
              </div>
            </div>
            <GeographicChart data={geoData?.businessGeographicData || []} loading={geoLoading} />
          </div>

          {/* Device & Browser */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MousePointerClick className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Devices & Browsers</h2>
                <p className="text-sm text-gray-500">How visitors access your page</p>
              </div>
            </div>
            <DeviceChart data={deviceData?.businessDeviceData || []} loading={deviceLoading} />
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Traffic Sources</h2>
              <p className="text-sm text-gray-500">Where your visitors come from</p>
            </div>
          </div>
          <ReferrerChart
            data={referrerData?.businessReferrerData || []}
            loading={referrerLoading}
          />
        </div>

        {/* Top Performing Listings */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-pink-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Top Performing Content</h2>
              <p className="text-sm text-gray-500">Your best performing listings</p>
            </div>
          </div>
          <TopListingsTable
            data={topListingsData?.businessTopListings || []}
            loading={topListingsLoading}
          />
        </div>
      </div>
    </div>
  );
}

function getLastNDays(n: number): string {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return date.toISOString().split('T')[0];
}
