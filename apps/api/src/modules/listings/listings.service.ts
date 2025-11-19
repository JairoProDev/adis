import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/common/services/prisma.service';
import { generateSlug } from '@publicadis/database';
import { CreateListingInput, UpdateListingInput, ListingFilters } from './dto/listing.input';

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, tenantId: string, input: CreateListingInput) {
    const slug = input.slug || generateSlug(input.title);

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

  async findAll(tenantId: string, filters?: ListingFilters) {
    const where: any = {
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
      if (filters.minPrice) where.price.gte = filters.minPrice;
      if (filters.maxPrice) where.price.lte = filters.maxPrice;
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

  async findOne(slug: string) {
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
      throw new NotFoundException('Listing not found');
    }

    // Increment view count
    await this.prisma.listing.update({
      where: { id: listing.id },
      data: { viewCount: { increment: 1 } },
    });

    return listing;
  }

  async update(userId: string, id: string, input: UpdateListingInput) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.userId !== userId) {
      throw new ForbiddenException('Not authorized');
    }

    return this.prisma.listing.update({
      where: { id },
      data: input,
    });
  }

  async delete(userId: string, id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.userId !== userId) {
      throw new ForbiddenException('Not authorized');
    }

    await this.prisma.listing.delete({
      where: { id },
    });

    return { success: true };
  }
}
