import { Module } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { ListingsResolver } from './listings.resolver';
import { PrismaService } from '@/common/services/prisma.service';

@Module({
  providers: [ListingsService, ListingsResolver, PrismaService],
  exports: [ListingsService],
})
export class ListingsModule {}
