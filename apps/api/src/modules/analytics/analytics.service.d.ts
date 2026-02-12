import { PrismaService } from '@/common/services/prisma.service';
export interface AnalyticsSummary {
    totalViews: number;
    totalClicks: number;
    uniqueVisitors: number;
    conversionRate: number;
    avgSessionDuration: number;
    bounceRate: number;
}
export interface TimeSeriesData {
    date: string;
    views: number;
    clicks: number;
    visitors: number;
}
export interface GeographicData {
    country: string;
    city: string;
    count: number;
}
export interface DeviceData {
    device: string;
    browser: string;
    count: number;
}
export interface TopPerformer {
    id: string;
    title: string;
    type: 'business' | 'listing';
    views: number;
    clicks: number;
    conversionRate: number;
}
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    /**
     * Track a page view
     */
    trackPageView(data: {
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
    }): Promise<any>;
    /**
     * Get analytics summary for a business
     */
    getBusinessSummary(businessId: string, startDate: Date, endDate: Date): Promise<AnalyticsSummary>;
    /**
     * Get time series data
     */
    getTimeSeriesData(businessId: string, startDate: Date, endDate: Date, interval?: 'day' | 'week' | 'month'): Promise<TimeSeriesData[]>;
    /**
     * Get geographic distribution
     */
    getGeographicData(businessId: string, startDate: Date, endDate: Date): Promise<GeographicData[]>;
    /**
     * Get device/browser breakdown
     */
    getDeviceData(businessId: string, startDate: Date, endDate: Date): Promise<DeviceData[]>;
    /**
     * Get referrer sources
     */
    getReferrerData(businessId: string, startDate: Date, endDate: Date): Promise<Array<{
        referrer: string;
        count: number;
    }>>;
    /**
     * Get top performing listings
     */
    getTopListings(businessId: string, startDate: Date, endDate: Date, limit?: number): Promise<TopPerformer[]>;
    /**
     * Get analytics for tenant (all businesses)
     */
    getTenantSummary(tenantId: string, startDate: Date, endDate: Date): Promise<AnalyticsSummary & {
        totalBusinesses: number;
        totalListings: number;
    }>;
}
//# sourceMappingURL=analytics.service.d.ts.map