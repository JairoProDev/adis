import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsResolver } from './uploads.resolver';
import { PrismaService } from '@/common/services/prisma.service';

@Module({
  providers: [UploadsService, UploadsResolver, PrismaService],
  exports: [UploadsService],
})
export class UploadsModule {}
