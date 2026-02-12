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
exports.TenantAnalyticsSummary = exports.TopPerformer = exports.ReferrerDataPoint = exports.DeviceDataPoint = exports.GeographicDataPoint = exports.TimeSeriesDataPoint = exports.AnalyticsSummary = exports.TenantAnalyticsQueryInput = exports.AnalyticsQueryInput = exports.TrackPageViewInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
let TrackPageViewInput = class TrackPageViewInput {
};
exports.TrackPageViewInput = TrackPageViewInput;
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TrackPageViewInput.prototype, "userId", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TrackPageViewInput.prototype, "businessId", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TrackPageViewInput.prototype, "listingId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TrackPageViewInput.prototype, "tenantId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TrackPageViewInput.prototype, "ipAddress", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TrackPageViewInput.prototype, "userAgent", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TrackPageViewInput.prototype, "country", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TrackPageViewInput.prototype, "city", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TrackPageViewInput.prototype, "device", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TrackPageViewInput.prototype, "browser", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TrackPageViewInput.prototype, "referrer", void 0);
exports.TrackPageViewInput = TrackPageViewInput = __decorate([
    (0, graphql_1.InputType)()
], TrackPageViewInput);
let AnalyticsQueryInput = class AnalyticsQueryInput {
};
exports.AnalyticsQueryInput = AnalyticsQueryInput;
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AnalyticsQueryInput.prototype, "businessId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], AnalyticsQueryInput.prototype, "startDate", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], AnalyticsQueryInput.prototype, "endDate", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsEnum)(['day', 'week', 'month']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AnalyticsQueryInput.prototype, "interval", void 0);
exports.AnalyticsQueryInput = AnalyticsQueryInput = __decorate([
    (0, graphql_1.InputType)()
], AnalyticsQueryInput);
let TenantAnalyticsQueryInput = class TenantAnalyticsQueryInput {
};
exports.TenantAnalyticsQueryInput = TenantAnalyticsQueryInput;
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TenantAnalyticsQueryInput.prototype, "tenantId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], TenantAnalyticsQueryInput.prototype, "startDate", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], TenantAnalyticsQueryInput.prototype, "endDate", void 0);
exports.TenantAnalyticsQueryInput = TenantAnalyticsQueryInput = __decorate([
    (0, graphql_1.InputType)()
], TenantAnalyticsQueryInput);
// Output Types
let AnalyticsSummary = class AnalyticsSummary {
};
exports.AnalyticsSummary = AnalyticsSummary;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], AnalyticsSummary.prototype, "totalViews", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], AnalyticsSummary.prototype, "totalClicks", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], AnalyticsSummary.prototype, "uniqueVisitors", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], AnalyticsSummary.prototype, "conversionRate", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], AnalyticsSummary.prototype, "avgSessionDuration", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], AnalyticsSummary.prototype, "bounceRate", void 0);
exports.AnalyticsSummary = AnalyticsSummary = __decorate([
    (0, graphql_1.ObjectType)()
], AnalyticsSummary);
let TimeSeriesDataPoint = class TimeSeriesDataPoint {
};
exports.TimeSeriesDataPoint = TimeSeriesDataPoint;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], TimeSeriesDataPoint.prototype, "date", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], TimeSeriesDataPoint.prototype, "views", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], TimeSeriesDataPoint.prototype, "clicks", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], TimeSeriesDataPoint.prototype, "visitors", void 0);
exports.TimeSeriesDataPoint = TimeSeriesDataPoint = __decorate([
    (0, graphql_1.ObjectType)()
], TimeSeriesDataPoint);
let GeographicDataPoint = class GeographicDataPoint {
};
exports.GeographicDataPoint = GeographicDataPoint;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], GeographicDataPoint.prototype, "country", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], GeographicDataPoint.prototype, "city", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], GeographicDataPoint.prototype, "count", void 0);
exports.GeographicDataPoint = GeographicDataPoint = __decorate([
    (0, graphql_1.ObjectType)()
], GeographicDataPoint);
let DeviceDataPoint = class DeviceDataPoint {
};
exports.DeviceDataPoint = DeviceDataPoint;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], DeviceDataPoint.prototype, "device", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], DeviceDataPoint.prototype, "browser", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], DeviceDataPoint.prototype, "count", void 0);
exports.DeviceDataPoint = DeviceDataPoint = __decorate([
    (0, graphql_1.ObjectType)()
], DeviceDataPoint);
let ReferrerDataPoint = class ReferrerDataPoint {
};
exports.ReferrerDataPoint = ReferrerDataPoint;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ReferrerDataPoint.prototype, "referrer", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], ReferrerDataPoint.prototype, "count", void 0);
exports.ReferrerDataPoint = ReferrerDataPoint = __decorate([
    (0, graphql_1.ObjectType)()
], ReferrerDataPoint);
let TopPerformer = class TopPerformer {
};
exports.TopPerformer = TopPerformer;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], TopPerformer.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], TopPerformer.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], TopPerformer.prototype, "type", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], TopPerformer.prototype, "views", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], TopPerformer.prototype, "clicks", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], TopPerformer.prototype, "conversionRate", void 0);
exports.TopPerformer = TopPerformer = __decorate([
    (0, graphql_1.ObjectType)()
], TopPerformer);
let TenantAnalyticsSummary = class TenantAnalyticsSummary {
};
exports.TenantAnalyticsSummary = TenantAnalyticsSummary;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], TenantAnalyticsSummary.prototype, "totalViews", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], TenantAnalyticsSummary.prototype, "totalClicks", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], TenantAnalyticsSummary.prototype, "uniqueVisitors", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], TenantAnalyticsSummary.prototype, "conversionRate", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], TenantAnalyticsSummary.prototype, "avgSessionDuration", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], TenantAnalyticsSummary.prototype, "bounceRate", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], TenantAnalyticsSummary.prototype, "totalBusinesses", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], TenantAnalyticsSummary.prototype, "totalListings", void 0);
exports.TenantAnalyticsSummary = TenantAnalyticsSummary = __decorate([
    (0, graphql_1.ObjectType)()
], TenantAnalyticsSummary);
//# sourceMappingURL=analytics.input.js.map