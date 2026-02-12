import { AnalyticsService } from './analytics.service';
import { TrackPageViewInput, AnalyticsQueryInput, TenantAnalyticsQueryInput, AnalyticsSummary, TimeSeriesDataPoint, GeographicDataPoint, DeviceDataPoint, ReferrerDataPoint, TopPerformer, TenantAnalyticsSummary } from './dto/analytics.input';
export declare class AnalyticsResolver {
    private analyticsService;
    constructor(analyticsService: AnalyticsService);
    /**
     * Track a page view (public - no auth)
     */
    trackPageView(input: TrackPageViewInput): Promise<boolean>;
    /**
     * Get analytics summary for a business
     */
    businessAnalyticsSummary(input: AnalyticsQueryInput): Promise<AnalyticsSummary>;
    /**
     * Get time series data
     */
    businessTimeSeriesData(input: AnalyticsQueryInput): Promise<TimeSeriesDataPoint[]>;
    /**
     * Get geographic distribution
     */
    businessGeographicData(input: AnalyticsQueryInput): Promise<GeographicDataPoint[]>;
    /**
     * Get device/browser breakdown
     */
    businessDeviceData(input: AnalyticsQueryInput): Promise<DeviceDataPoint[]>;
    /**
     * Get referrer sources
     */
    businessReferrerData(input: AnalyticsQueryInput): Promise<ReferrerDataPoint[]>;
    /**
     * Get top performing listings
     */
    businessTopListings(input: AnalyticsQueryInput): Promise<TopPerformer[]>;
    /**
     * Get tenant-wide analytics
     */
    tenantAnalyticsSummary(user: any, input: TenantAnalyticsQueryInput): Promise<TenantAnalyticsSummary>;
}
//# sourceMappingURL=analytics.resolver.d.ts.map