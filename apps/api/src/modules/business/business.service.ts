import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/common/services/prisma.service';
import { generateSlug } from '@publicadis/database';
import { CreateBusinessInput, UpdateBusinessInput } from './dto/business.input';

@Injectable()
export class BusinessService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, tenantId: string, input: CreateBusinessInput) {
    const slug = input.slug || generateSlug(input.name);

    // Check if slug is taken
    const existing = await this.prisma.business.findUnique({
      where: { slug },
    });

    if (existing) {
      throw new ForbiddenException('Business with this slug already exists');
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

  async findAll(tenantId: string, filters?: any) {
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

  async findOne(slug: string) {
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
      throw new NotFoundException('Business not found');
    }

    // Increment view count
    await this.prisma.business.update({
      where: { id: business.id },
      data: { viewCount: { increment: 1 } },
    });

    return business;
  }

  async update(userId: string, id: string, input: UpdateBusinessInput) {
    const business = await this.prisma.business.findUnique({
      where: { id },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    if (business.ownerId !== userId) {
      throw new ForbiddenException('Not authorized');
    }

    return this.prisma.business.update({
      where: { id },
      data: input,
    });
  }

  async delete(userId: string, id: string) {
    const business = await this.prisma.business.findUnique({
      where: { id },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    if (business.ownerId !== userId) {
      throw new ForbiddenException('Not authorized');
    }

    await this.prisma.business.delete({
      where: { id },
    });

    return { success: true };
  }
}
