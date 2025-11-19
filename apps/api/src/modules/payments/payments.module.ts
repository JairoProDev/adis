import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentsService } from './payments.service';
import { PaymentsResolver } from './payments.resolver';
import { PaymentsController } from './payments.controller';
import { PrismaService } from '@/common/services/prisma.service';
import { EmailService } from '../email/email.service';

@Module({
  imports: [ConfigModule],
  providers: [PaymentsService, PaymentsResolver, PrismaService, EmailService],
  controllers: [PaymentsController],
  exports: [PaymentsService],
})
export class PaymentsModule {}
