import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import {
  TrackPageViewInput,
  AnalyticsQueryInput,
  TenantAnalyticsQueryInput,
  AnalyticsSummary,
  TimeSeriesDataPoint,
  GeographicDataPoint,
  DeviceDataPoint,
  ReferrerDataPoint,
  TopPerformer,
  TenantAnalyticsSummary,
} from './dto/analytics.input';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@Resolver('Analytics')
export class AnalyticsResolver {
  constructor(private analyticsService: AnalyticsService) {}

  /**
   * Track a page view (public - no auth)
   */
  @Mutation(() => Boolean)
  async trackPageView(@Args('input') input: TrackPageViewInput): Promise<boolean> {
    await this.analyticsService.trackPageView(input);
    return true;
  }

  /**
   * Get analytics summary for a business
   */
  @Query(() => AnalyticsSummary)
  @UseGuards(JwtAuthGuard)
  async businessAnalyticsSummary(
    @Args('input') input: AnalyticsQueryInput,
  ): Promise<AnalyticsSummary> {
    const startDate = new Date(input.startDate);
    const endDate = new Date(input.endDate);
    return this.analyticsService.getBusinessSummary(input.businessId, startDate, endDate);
  }

  /**
   * Get time series data
   */
  @Query(() => [TimeSeriesDataPoint])
  @UseGuards(JwtAuthGuard)
  async businessTimeSeriesData(
    @Args('input') input: AnalyticsQueryInput,
  ): Promise<TimeSeriesDataPoint[]> {
    const startDate = new Date(input.startDate);
    const endDate = new Date(input.endDate);
    return this.analyticsService.getTimeSeriesData(
      input.businessId,
      startDate,
      endDate,
      input.interval || 'day',
    );
  }

  /**
   * Get geographic distribution
   */
  @Query(() => [GeographicDataPoint])
  @UseGuards(JwtAuthGuard)
  async businessGeographicData(
    @Args('input') input: AnalyticsQueryInput,
  ): Promise<GeographicDataPoint[]> {
    const startDate = new Date(input.startDate);
    const endDate = new Date(input.endDate);
    return this.analyticsService.getGeographicData(input.businessId, startDate, endDate);
  }

  /**
   * Get device/browser breakdown
   */
  @Query(() => [DeviceDataPoint])
  @UseGuards(JwtAuthGuard)
  async businessDeviceData(
    @Args('input') input: AnalyticsQueryInput,
  ): Promise<DeviceDataPoint[]> {
    const startDate = new Date(input.startDate);
    const endDate = new Date(input.endDate);
    return this.analyticsService.getDeviceData(input.businessId, startDate, endDate);
  }

  /**
   * Get referrer sources
   */
  @Query(() => [ReferrerDataPoint])
  @UseGuards(JwtAuthGuard)
  async businessReferrerData(
    @Args('input') input: AnalyticsQueryInput,
  ): Promise<ReferrerDataPoint[]> {
    const startDate = new Date(input.startDate);
    const endDate = new Date(input.endDate);
    return this.analyticsService.getReferrerData(input.businessId, startDate, endDate);
  }

  /**
   * Get top performing listings
   */
  @Query(() => [TopPerformer])
  @UseGuards(JwtAuthGuard)
  async businessTopListings(
    @Args('input') input: AnalyticsQueryInput,
  ): Promise<TopPerformer[]> {
    const startDate = new Date(input.startDate);
    const endDate = new Date(input.endDate);
    return this.analyticsService.getTopListings(input.businessId, startDate, endDate);
  }

  /**
   * Get tenant-wide analytics
   */
  @Query(() => TenantAnalyticsSummary)
  @UseGuards(JwtAuthGuard)
  async tenantAnalyticsSummary(
    @CurrentUser() user: any,
    @Args('input') input: TenantAnalyticsQueryInput,
  ): Promise<TenantAnalyticsSummary> {
    // TODO: Add admin guard to verify user has access to tenant analytics
    const startDate = new Date(input.startDate);
    const endDate = new Date(input.endDate);
    return this.analyticsService.getTenantSummary(input.tenantId, startDate, endDate);
  }
}
