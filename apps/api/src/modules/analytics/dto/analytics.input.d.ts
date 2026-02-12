export declare class TrackPageViewInput {
    userId?: string;
    businessId?: string;
    listingId?: string;
    tenantId: string;
    ipAddress: string;
    userAgent: string;
    country?: string;
    city?: string;
    device?: string;
    browser?: string;
    referrer?: string;
}
export declare class AnalyticsQueryInput {
    businessId: string;
    startDate: string;
    endDate: string;
    interval?: 'day' | 'week' | 'month';
}
export declare class TenantAnalyticsQueryInput {
    tenantId: string;
    startDate: string;
    endDate: string;
}
export declare class AnalyticsSummary {
    totalViews: number;
    totalClicks: number;
    uniqueVisitors: number;
    conversionRate: number;
    avgSessionDuration: number;
    bounceRate: number;
}
export declare class TimeSeriesDataPoint {
    date: string;
    views: number;
    clicks: number;
    visitors: number;
}
export declare class GeographicDataPoint {
    country: string;
    city: string;
    count: number;
}
export declare class DeviceDataPoint {
    device: string;
    browser: string;
    count: number;
}
export declare class ReferrerDataPoint {
    referrer: string;
    count: number;
}
export declare class TopPerformer {
    id: string;
    title: string;
    type: string;
    views: number;
    clicks: number;
    conversionRate: number;
}
export declare class TenantAnalyticsSummary {
    totalViews: number;
    totalClicks: number;
    uniqueVisitors: number;
    conversionRate: number;
    avgSessionDuration: number;
    bounceRate: number;
    totalBusinesses: number;
    totalListings: number;
}
//# sourceMappingURL=analytics.input.d.ts.map