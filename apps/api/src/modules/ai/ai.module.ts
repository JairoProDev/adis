import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AIService } from './ai.service';
import { EmbeddingService } from './services/embedding.service';
import { RAGService } from './services/rag.service';
import { AIResolver } from './ai.resolver';
import { PrismaService } from '@/common/services/prisma.service';

@Module({
  imports: [ConfigModule],
  providers: [
    AIService,
    EmbeddingService,
    RAGService,
    AIResolver,
    PrismaService,
  ],
  exports: [AIService, EmbeddingService, RAGService],
})
export class AIModule {}
