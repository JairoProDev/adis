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
exports.ListingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/services/prisma.service");
const database_1 = require("@publicadis/database");
let ListingsService = class ListingsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, tenantId, input) {
        const slug = input.slug || (0, database_1.generateSlug)(input.title);
        return this.prisma.listing.create({
            data: {
                ...input,
                slug,
                userId,
                tenantId,
                status: 'ACTIVE',
                publishedAt: new Date(),
            },
        });
    }
    async findAll(tenantId, filters) {
        const where = {
            tenantId,
            status: 'ACTIVE',
        };
        if (filters?.categoryId) {
            where.categoryId = filters.categoryId;
        }
        if (filters?.city) {
            where.city = filters.city;
        }
        if (filters?.minPrice || filters?.maxPrice) {
            where.price = {};
            if (filters.minPrice)
                where.price.gte = filters.minPrice;
            if (filters.maxPrice)
                where.price.lte = filters.maxPrice;
        }
        if (filters?.query) {
            where.OR = [
                { title: { contains: filters.query, mode: 'insensitive' } },
                { description: { contains: filters.query, mode: 'insensitive' } },
            ];
        }
        return this.prisma.listing.findMany({
            where,
            include: {
                category: true,
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
                business: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        logo: true,
                    },
                },
                images: {
                    take: 1,
                },
            },
            orderBy: filters?.sortBy === 'price'
                ? { price: filters.sortOrder || 'asc' }
                : { createdAt: 'desc' },
            skip: filters?.skip || 0,
            take: filters?.take || 20,
        });
    }
    async findOne(slug) {
        const listing = await this.prisma.listing.findUnique({
            where: { slug },
            include: {
                category: true,
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                        phone: true,
                    },
                },
                business: true,
                images: true,
                reviews: {
                    where: { status: 'PUBLISHED' },
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                avatar: true,
                            },
                        },
                    },
                    take: 10,
                },
            },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        // Increment view count
        await this.prisma.listing.update({
            where: { id: listing.id },
            data: { viewCount: { increment: 1 } },
        });
        return listing;
    }
    async update(userId, id, input) {
        const listing = await this.prisma.listing.findUnique({
            where: { id },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        if (listing.userId !== userId) {
            throw new common_1.ForbiddenException('Not authorized');
        }
        return this.prisma.listing.update({
            where: { id },
            data: input,
        });
    }
    async delete(userId, id) {
        const listing = await this.prisma.listing.findUnique({
            where: { id },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        if (listing.userId !== userId) {
            throw new common_1.ForbiddenException('Not authorized');
        }
        await this.prisma.listing.delete({
            where: { id },
        });
        return { success: true };
    }
};
exports.ListingsService = ListingsService;
exports.ListingsService = ListingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ListingsService);
//# sourceMappingURL=listings.service.js.map