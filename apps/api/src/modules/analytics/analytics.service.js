"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/services/prisma.service");
let AnalyticsService = class AnalyticsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     * Track a page view
     */
    async trackPageView(data) {
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
    async getBusinessSummary(businessId, startDate, endDate) {
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
        const singleViewVisitors = await this.prisma.$queryRaw `
      SELECT COUNT(DISTINCT ip_address) as count
      FROM "PageView"
      WHERE business_id = ${businessId}
        AND created_at >= ${startDate}
        AND created_at <= ${endDate}
      GROUP BY ip_address
      HAVING COUNT(*) = 1
    `;
        const bounceRate = uniqueVisitors.length > 0
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
    async getTimeSeriesData(businessId, startDate, endDate, interval = 'day') {
        const views = await this.prisma.$queryRaw `
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
    async getGeographicData(businessId, startDate, endDate) {
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
    async getDeviceData(businessId, startDate, endDate) {
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
    async getReferrerData(businessId, startDate, endDate) {
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
    async getTopListings(businessId, startDate, endDate, limit = 10) {
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
            type: 'listing',
            views: listing.viewCount,
            clicks: listing.clickCount,
            conversionRate: listing.viewCount > 0
                ? (listing.clickCount / listing.viewCount) * 100
                : 0,
        }));
    }
    /**
     * Get analytics for tenant (all businesses)
     */
    async getTenantSummary(tenantId, startDate, endDate) {
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
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map