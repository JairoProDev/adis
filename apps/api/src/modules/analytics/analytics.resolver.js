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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const analytics_service_1 = require("./analytics.service");
const analytics_input_1 = require("./dto/analytics.input");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let AnalyticsResolver = class AnalyticsResolver {
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    /**
     * Track a page view (public - no auth)
     */
    async trackPageView(input) {
        await this.analyticsService.trackPageView(input);
        return true;
    }
    /**
     * Get analytics summary for a business
     */
    async businessAnalyticsSummary(input) {
        const startDate = new Date(input.startDate);
        const endDate = new Date(input.endDate);
        return this.analyticsService.getBusinessSummary(input.businessId, startDate, endDate);
    }
    /**
     * Get time series data
     */
    async businessTimeSeriesData(input) {
        const startDate = new Date(input.startDate);
        const endDate = new Date(input.endDate);
        return this.analyticsService.getTimeSeriesData(input.businessId, startDate, endDate, input.interval || 'day');
    }
    /**
     * Get geographic distribution
     */
    async businessGeographicData(input) {
        const startDate = new Date(input.startDate);
        const endDate = new Date(input.endDate);
        return this.analyticsService.getGeographicData(input.businessId, startDate, endDate);
    }
    /**
     * Get device/browser breakdown
     */
    async businessDeviceData(input) {
        const startDate = new Date(input.startDate);
        const endDate = new Date(input.endDate);
        return this.analyticsService.getDeviceData(input.businessId, startDate, endDate);
    }
    /**
     * Get referrer sources
     */
    async businessReferrerData(input) {
        const startDate = new Date(input.startDate);
        const endDate = new Date(input.endDate);
        return this.analyticsService.getReferrerData(input.businessId, startDate, endDate);
    }
    /**
     * Get top performing listings
     */
    async businessTopListings(input) {
        const startDate = new Date(input.startDate);
        const endDate = new Date(input.endDate);
        return this.analyticsService.getTopListings(input.businessId, startDate, endDate);
    }
    /**
     * Get tenant-wide analytics
     */
    async tenantAnalyticsSummary(user, input) {
        // TODO: Add admin guard to verify user has access to tenant analytics
        const startDate = new Date(input.startDate);
        const endDate = new Date(input.endDate);
        return this.analyticsService.getTenantSummary(input.tenantId, startDate, endDate);
    }
};
exports.AnalyticsResolver = AnalyticsResolver;
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analytics_input_1.TrackPageViewInput]),
    __metadata("design:returntype", Promise)
], AnalyticsResolver.prototype, "trackPageView", null);
__decorate([
    (0, graphql_1.Query)(() => analytics_input_1.AnalyticsSummary),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analytics_input_1.AnalyticsQueryInput]),
    __metadata("design:returntype", Promise)
], AnalyticsResolver.prototype, "businessAnalyticsSummary", null);
__decorate([
    (0, graphql_1.Query)(() => [analytics_input_1.TimeSeriesDataPoint]),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analytics_input_1.AnalyticsQueryInput]),
    __metadata("design:returntype", Promise)
], AnalyticsResolver.prototype, "businessTimeSeriesData", null);
__decorate([
    (0, graphql_1.Query)(() => [analytics_input_1.GeographicDataPoint]),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analytics_input_1.AnalyticsQueryInput]),
    __metadata("design:returntype", Promise)
], AnalyticsResolver.prototype, "businessGeographicData", null);
__decorate([
    (0, graphql_1.Query)(() => [analytics_input_1.DeviceDataPoint]),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analytics_input_1.AnalyticsQueryInput]),
    __metadata("design:returntype", Promise)
], AnalyticsResolver.prototype, "businessDeviceData", null);
__decorate([
    (0, graphql_1.Query)(() => [analytics_input_1.ReferrerDataPoint]),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analytics_input_1.AnalyticsQueryInput]),
    __metadata("design:returntype", Promise)
], AnalyticsResolver.prototype, "businessReferrerData", null);
__decorate([
    (0, graphql_1.Query)(() => [analytics_input_1.TopPerformer]),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analytics_input_1.AnalyticsQueryInput]),
    __metadata("design:returntype", Promise)
], AnalyticsResolver.prototype, "businessTopListings", null);
__decorate([
    (0, graphql_1.Query)(() => analytics_input_1.TenantAnalyticsSummary),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, analytics_input_1.TenantAnalyticsQueryInput]),
    __metadata("design:returntype", Promise)
], AnalyticsResolver.prototype, "tenantAnalyticsSummary", null);
exports.AnalyticsResolver = AnalyticsResolver = __decorate([
    (0, graphql_1.Resolver)('Analytics'),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsResolver);
//# sourceMappingURL=analytics.resolver.js.map