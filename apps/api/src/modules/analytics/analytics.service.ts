import { Injectable } from '@nestjs/common';
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

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Track a page view
   */
  async trackPageView(data: {
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
  }) {
    return this.prisma.pageView.create({
      data: {
        userId: data.userId,
        businessId: data.businessId,
        listingId: data.listingId,
        tenantId: data.tenantId,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        country: data.country,
        city: data.city,
        device: data.device,
        browser: data.browser,
        referrer: data.referrer,
      },
    });
  }

  /**
   * Get analytics summary for a business
   */
  async getBusinessSummary(
    businessId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<AnalyticsSummary> {
    // Get page views
    const views = await this.prisma.pageView.count({
      where: {
        businessId,
        createdAt: { gte: startDate, lte: endDate },
      },
    });

    // Get unique visitors
    const uniqueVisitors = await this.prisma.pageView.groupBy({
      by: ['ipAddress'],
      where: {
        businessId,
        createdAt: { gte: startDate, lte: endDate },
      },
      _count: true,
    });

    // Get business data for clicks
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      select: { clickCount: true, viewCount: true },
    });

    // Calculate metrics
    const totalClicks = business?.clickCount || 0;
    const conversionRate = views > 0 ? (totalClicks / views) * 100 : 0;

    // Calculate bounce rate (visitors with only 1 view)
    const singleViewVisitors = await this.prisma.$queryRaw<any[]>`
      SELECT COUNT(DISTINCT ip_address) as count
      FROM "PageView"
      WHERE business_id = ${businessId}
        AND created_at >= ${startDate}
        AND created_at <= ${endDate}
      GROUP BY ip_address
      HAVING COUNT(*) = 1
    `;
    const bounceRate =
      uniqueVisitors.length > 0
        ? ((singleViewVisitors[0]?.count || 0) / uniqueVisitors.length) * 100
        : 0;

    // Calculate average session duration (mock for now)
    const avgSessionDuration = 180; // 3 minutes average

    return {
      totalViews: views,
      totalClicks,
      uniqueVisitors: uniqueVisitors.length,
      conversionRate,
      avgSessionDuration,
      bounceRate,
    };
  }

  /**
   * Get time series data
   */
  async getTimeSeriesData(
    businessId: string,
    startDate: Date,
    endDate: Date,
    interval: 'day' | 'week' | 'month' = 'day',
  ): Promise<TimeSeriesData[]> {
    const views = await this.prisma.$queryRaw<any[]>`
      SELECT
        DATE_TRUNC(${interval}, created_at) as date,
        COUNT(*) as views,
        COUNT(DISTINCT ip_address) as visitors
      FROM "PageView"
      WHERE business_id = ${businessId}
        AND created_at >= ${startDate}
        AND created_at <= ${endDate}
      GROUP BY DATE_TRUNC(${interval}, created_at)
      ORDER BY date ASC
    `;

    return views.map((row) => ({
      date: row.date.toISOString().split('T')[0],
      views: parseInt(row.views),
      clicks: 0, // TODO: Track clicks separately
      visitors: parseInt(row.visitors),
    }));
  }

  /**
   * Get geographic distribution
   */
  async getGeographicData(
    businessId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<GeographicData[]> {
    const data = await this.prisma.pageView.groupBy({
      by: ['country', 'city'],
      where: {
        businessId,
        createdAt: { gte: startDate, lte: endDate },
        country: { not: null },
      },
      _count: true,
      orderBy: { _count: { _all: 'desc' } },
      take: 20,
    });

    return data.map((row) => ({
      country: row.country || 'Unknown',
      city: row.city || 'Unknown',
      count: row._count,
    }));
  }

  /**
   * Get device/browser breakdown
   */
  async getDeviceData(
    businessId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<DeviceData[]> {
    const data = await this.prisma.pageView.groupBy({
      by: ['device', 'browser'],
      where: {
        businessId,
        createdAt: { gte: startDate, lte: endDate },
      },
      _count: true,
      orderBy: { _count: { _all: 'desc' } },
    });

    return data.map((row) => ({
      device: row.device || 'Unknown',
      browser: row.browser || 'Unknown',
      count: row._count,
    }));
  }

  /**
   * Get referrer sources
   */
  async getReferrerData(
    businessId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Array<{ referrer: string; count: number }>> {
    const data = await this.prisma.pageView.groupBy({
      by: ['referrer'],
      where: {
        businessId,
        createdAt: { gte: startDate, lte: endDate },
        referrer: { not: null },
      },
      _count: true,
      orderBy: { _count: { _all: 'desc' } },
      take: 10,
    });

    return data.map((row) => ({
      referrer: row.referrer || 'Direct',
      count: row._count,
    }));
  }

  /**
   * Get top performing listings
   */
  async getTopListings(
    businessId: string,
    startDate: Date,
    endDate: Date,
    limit: number = 10,
  ): Promise<TopPerformer[]> {
    const listings = await this.prisma.listing.findMany({
      where: {
        businessId,
        createdAt: { gte: startDate, lte: endDate },
      },
      select: {
        id: true,
        title: true,
        viewCount: true,
        clickCount: true,
      },
      orderBy: { viewCount: 'desc' },
      take: limit,
    });

    return listings.map((listing) => ({
      id: listing.id,
      title: listing.title,
      type: 'listing' as const,
      views: listing.viewCount,
      clicks: listing.clickCount,
      conversionRate:
        listing.viewCount > 0
          ? (listing.clickCount / listing.viewCount) * 100
          : 0,
    }));
  }

  /**
   * Get analytics for tenant (all businesses)
   */
  async getTenantSummary(
    tenantId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<AnalyticsSummary & { totalBusinesses: number; totalListings: number }> {
    const [views, uniqueVisitors, businesses, listings] = await Promise.all([
      this.prisma.pageView.count({
        where: {
          tenantId,
          createdAt: { gte: startDate, lte: endDate },
        },
      }),
      this.prisma.pageView.groupBy({
        by: ['ipAddress'],
        where: {
          tenantId,
          createdAt: { gte: startDate, lte: endDate },
        },
      }),
      this.prisma.business.count({ where: { tenantId } }),
      this.prisma.listing.count({ where: { tenantId } }),
    ]);

    // Get total clicks across all businesses
    const clickData = await this.prisma.business.aggregate({
      where: { tenantId },
      _sum: { clickCount: true },
    });

    const totalClicks = clickData._sum.clickCount || 0;
    const conversionRate = views > 0 ? (totalClicks / views) * 100 : 0;

    return {
      totalViews: views,
      totalClicks,
      uniqueVisitors: uniqueVisitors.length,
      conversionRate,
      avgSessionDuration: 180,
      bounceRate: 45,
      totalBusinesses: businesses,
      totalListings: listings,
    };
  }
}
