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
exports.BusinessService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/services/prisma.service");
const database_1 = require("@publicadis/database");
let BusinessService = class BusinessService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, tenantId, input) {
        const slug = input.slug || (0, database_1.generateSlug)(input.name);
        // Check if slug is taken
        const existing = await this.prisma.business.findUnique({
            where: { slug },
        });
        if (existing) {
            throw new common_1.ForbiddenException('Business with this slug already exists');
        }
        return this.prisma.business.create({
            data: {
                ...input,
                slug,
                ownerId: userId,
                tenantId,
            },
        });
    }
    async findAll(tenantId, filters) {
        return this.prisma.business.findMany({
            where: {
                tenantId,
                status: 'ACTIVE',
                ...filters,
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(slug) {
        const business = await this.prisma.business.findUnique({
            where: { slug },
            include: {
                owner: true,
                listings: {
                    where: { status: 'ACTIVE' },
                    take: 10,
                },
                reviews: {
                    where: { status: 'PUBLISHED' },
                    take: 5,
                },
                socialLinks: true,
                businessHours: true,
            },
        });
        if (!business) {
            throw new common_1.NotFoundException('Business not found');
        }
        // Increment view count
        await this.prisma.business.update({
            where: { id: business.id },
            data: { viewCount: { increment: 1 } },
        });
        return business;
    }
    async update(userId, id, input) {
        const business = await this.prisma.business.findUnique({
            where: { id },
        });
        if (!business) {
            throw new common_1.NotFoundException('Business not found');
        }
        if (business.ownerId !== userId) {
            throw new common_1.ForbiddenException('Not authorized');
        }
        return this.prisma.business.update({
            where: { id },
            data: input,
        });
    }
    async delete(userId, id) {
        const business = await this.prisma.business.findUnique({
            where: { id },
        });
        if (!business) {
            throw new common_1.NotFoundException('Business not found');
        }
        if (business.ownerId !== userId) {
            throw new common_1.ForbiddenException('Not authorized');
        }
        await this.prisma.business.delete({
            where: { id },
        });
        return { success: true };
    }
    /**
     * Update page configuration (theme JSON)
     */
    async updatePageConfig(userId, businessId, theme) {
        const business = await this.prisma.business.findUnique({
            where: { id: businessId },
        });
        if (!business) {
            throw new common_1.NotFoundException('Business not found');
        }
        if (business.ownerId !== userId) {
            throw new common_1.ForbiddenException('Not authorized');
        }
        return this.prisma.business.update({
            where: { id: businessId },
            data: { theme },
            select: {
                id: true,
                slug: true,
                theme: true,
            },
        });
    }
    /**
     * Get page configuration
     */
    async getPageConfig(businessId) {
        const business = await this.prisma.business.findUnique({
            where: { id: businessId },
            select: {
                id: true,
                slug: true,
                theme: true,
            },
        });
        if (!business) {
            throw new common_1.NotFoundException('Business not found');
        }
        return business;
    }
};
exports.BusinessService = BusinessService;
exports.BusinessService = BusinessService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BusinessService);
//# sourceMappingURL=business.service.js.map