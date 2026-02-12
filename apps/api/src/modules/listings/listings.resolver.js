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
exports.ListingsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const listings_service_1 = require("./listings.service");
const listing_input_1 = require("./dto/listing.input");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let ListingsResolver = class ListingsResolver {
    constructor(listingsService) {
        this.listingsService = listingsService;
    }
    async create(user, input) {
        return this.listingsService.create(user.id, user.tenantId, input);
    }
    async findAll(tenantId, filters) {
        return this.listingsService.findAll(tenantId, filters);
    }
    async findOne(slug) {
        return this.listingsService.findOne(slug);
    }
    async update(user, id, input) {
        return this.listingsService.update(user.id, id, input);
    }
    async delete(user, id) {
        return this.listingsService.delete(user.id, id);
    }
};
exports.ListingsResolver = ListingsResolver;
__decorate([
    (0, graphql_1.Mutation)('createListing'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, listing_input_1.CreateListingInput]),
    __metadata("design:returntype", Promise)
], ListingsResolver.prototype, "create", null);
__decorate([
    (0, graphql_1.Query)('listings'),
    __param(0, (0, graphql_1.Args)('tenantId', { defaultValue: 'publicadis' })),
    __param(1, (0, graphql_1.Args)('filters', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, listing_input_1.ListingFilters]),
    __metadata("design:returntype", Promise)
], ListingsResolver.prototype, "findAll", null);
__decorate([
    (0, graphql_1.Query)('listing'),
    __param(0, (0, graphql_1.Args)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ListingsResolver.prototype, "findOne", null);
__decorate([
    (0, graphql_1.Mutation)('updateListing'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __param(2, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, listing_input_1.UpdateListingInput]),
    __metadata("design:returntype", Promise)
], ListingsResolver.prototype, "update", null);
__decorate([
    (0, graphql_1.Mutation)('deleteListing'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ListingsResolver.prototype, "delete", null);
exports.ListingsResolver = ListingsResolver = __decorate([
    (0, graphql_1.Resolver)('Listing'),
    __metadata("design:paramtypes", [listings_service_1.ListingsService])
], ListingsResolver);
//# sourceMappingURL=listings.resolver.js.map