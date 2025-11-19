import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './gateway/chat.gateway';
import { PrismaService } from '@/common/services/prisma.service';

@Module({
  providers: [ChatService, ChatGateway, PrismaService],
  exports: [ChatService],
})
export class ChatModule {}
