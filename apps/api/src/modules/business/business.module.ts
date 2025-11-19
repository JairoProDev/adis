import { Module } from '@nestjs/common';
import { BusinessService } from './business.service';
import { BusinessResolver } from './business.resolver';
import { PrismaService } from '@/common/services/prisma.service';

@Module({
  providers: [BusinessService, BusinessResolver, PrismaService],
  exports: [BusinessService],
})
export class BusinessModule {}
