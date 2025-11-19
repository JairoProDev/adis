import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesResolver } from './categories.resolver';
import { PrismaService } from '@/common/services/prisma.service';

@Module({
  providers: [CategoriesService, CategoriesResolver, PrismaService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
