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
exports.BusinessResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const business_service_1 = require("./business.service");
const business_input_1 = require("./dto/business.input");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let BusinessResolver = class BusinessResolver {
    constructor(businessService) {
        this.businessService = businessService;
    }
    async create(user, input) {
        return this.businessService.create(user.id, user.tenantId, input);
    }
    async findAll(tenantId, city) {
        const filters = city ? { city } : {};
        return this.businessService.findAll(tenantId, filters);
    }
    async findOne(slug) {
        return this.businessService.findOne(slug);
    }
    async update(user, id, input) {
        return this.businessService.update(user.id, id, input);
    }
    async delete(user, id) {
        return this.businessService.delete(user.id, id);
    }
    async updatePageConfig(user, input) {
        return this.businessService.updatePageConfig(user.id, input.businessId, input.theme);
    }
    async getPageConfig(businessId) {
        return this.businessService.getPageConfig(businessId);
    }
};
exports.BusinessResolver = BusinessResolver;
__decorate([
    (0, graphql_1.Mutation)('createBusiness'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, business_input_1.CreateBusinessInput]),
    __metadata("design:returntype", Promise)
], BusinessResolver.prototype, "create", null);
__decorate([
    (0, graphql_1.Query)('businesses'),
    __param(0, (0, graphql_1.Args)('tenantId', { defaultValue: 'publicadis' })),
    __param(1, (0, graphql_1.Args)('city', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BusinessResolver.prototype, "findAll", null);
__decorate([
    (0, graphql_1.Query)('business'),
    __param(0, (0, graphql_1.Args)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BusinessResolver.prototype, "findOne", null);
__decorate([
    (0, graphql_1.Mutation)('updateBusiness'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __param(2, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, business_input_1.UpdateBusinessInput]),
    __metadata("design:returntype", Promise)
], BusinessResolver.prototype, "update", null);
__decorate([
    (0, graphql_1.Mutation)('deleteBusiness'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BusinessResolver.prototype, "delete", null);
__decorate([
    (0, graphql_1.Mutation)('updatePageConfig'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, business_input_1.UpdatePageConfigInput]),
    __metadata("design:returntype", Promise)
], BusinessResolver.prototype, "updatePageConfig", null);
__decorate([
    (0, graphql_1.Query)('pageConfig'),
    __param(0, (0, graphql_1.Args)('businessId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BusinessResolver.prototype, "getPageConfig", null);
exports.BusinessResolver = BusinessResolver = __decorate([
    (0, graphql_1.Resolver)('Business'),
    __metadata("design:paramtypes", [business_service_1.BusinessService])
], BusinessResolver);
//# sourceMappingURL=business.resolver.js.map