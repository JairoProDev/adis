import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/services/prisma.service';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, skip?: number, take?: number) {
    return this.prisma.user.findMany({
      where: { tenantId },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        ownedBusinesses: {
          take: 5,
        },
        subscriptions: {
          where: { status: 'ACTIVE' },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, input: UpdateUserInput) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data: input,
    });
  }

  async delete(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return { success: true };
  }

  async getBusinesses(userId: string) {
    return this.prisma.business.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getListings(userId: string) {
    return this.prisma.listing.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
