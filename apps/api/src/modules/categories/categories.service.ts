import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/services/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      where: { active: true },
      include: {
        fields: true,
        _count: {
          select: { listings: true },
        },
      },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(slug: string) {
    return this.prisma.category.findUnique({
      where: { slug },
      include: {
        fields: true,
        children: true,
      },
    });
  }
}
