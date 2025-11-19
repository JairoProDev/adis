import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AIService } from './ai.service';
import { RAGService } from './services/rag.service';
import {
  ChatInput,
  GenerateDescriptionInput,
  GenerateListingDescriptionInput,
  AddKnowledgeBaseInput,
  SearchKnowledgeBaseInput,
  AutoGenerateKBInput,
  SuggestKBInput,
  SearchResult,
  KnowledgeBaseSuggestion,
} from './dto/ai.input';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@Resolver('AI')
export class AIResolver {
  constructor(
    private aiService: AIService,
    private ragService: RAGService,
  ) {}

  /**
   * Chat with ADIS AI (public - no auth required)
   */
  @Mutation(() => String)
  async aiChat(@Args('input') input: ChatInput): Promise<string> {
    return this.aiService.chat(
      input.businessId,
      input.message,
      input.conversationHistory || [],
    );
  }

  /**
   * Generate business description using AI
   */
  @Mutation(() => String)
  @UseGuards(JwtAuthGuard)
  async aiGenerateBusinessDescription(
    @Args('input') input: GenerateDescriptionInput,
  ): Promise<string> {
    return this.aiService.generateBusinessDescription(
      input.businessName,
      input.category,
      input.keywords,
    );
  }

  /**
   * Generate listing description using AI
   */
  @Mutation(() => String)
  @UseGuards(JwtAuthGuard)
  async aiGenerateListingDescription(
    @Args('input') input: GenerateListingDescriptionInput,
  ): Promise<string> {
    return this.aiService.generateListingDescription(
      input.title,
      input.category,
      input.price,
      input.features,
    );
  }

  /**
   * Add entry to knowledge base
   */
  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async aiAddKnowledgeBase(
    @CurrentUser() user: any,
    @Args('input') input: AddKnowledgeBaseInput,
  ): Promise<boolean> {
    // TODO: Verify user owns the business
    await this.ragService.addKnowledgeBase(
      input.businessId,
      input.question,
      input.answer,
      input.category,
    );
    return true;
  }

  /**
   * Search knowledge base (for testing/admin)
   */
  @Query(() => [SearchResult])
  @UseGuards(JwtAuthGuard)
  async aiSearchKnowledgeBase(@Args('input') input: SearchKnowledgeBaseInput): Promise<SearchResult[]> {
    return this.ragService.searchKnowledgeBase(
      input.businessId,
      input.query,
      input.limit || 5,
    );
  }

  /**
   * Auto-generate knowledge base from business data
   */
  @Mutation(() => Int)
  @UseGuards(JwtAuthGuard)
  async aiAutoGenerateKnowledgeBase(
    @CurrentUser() user: any,
    @Args('input') input: AutoGenerateKBInput,
  ): Promise<number> {
    // TODO: Verify user owns the business
    return this.ragService.autoGenerateKnowledgeBase(input.businessId);
  }

  /**
   * Suggest knowledge base entries using AI
   */
  @Mutation(() => [KnowledgeBaseSuggestion])
  @UseGuards(JwtAuthGuard)
  async aiSuggestKnowledgeBase(@Args('input') input: SuggestKBInput): Promise<KnowledgeBaseSuggestion[]> {
    return this.aiService.suggestKnowledgeBase(
      input.businessName,
      input.description,
      input.category,
    );
  }

  /**
   * Validate Groq API key (admin only)
   */
  @Query(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async aiValidateApiKey(@CurrentUser() user: any): Promise<boolean> {
    // TODO: Add admin guard
    return this.aiService.validateApiKey();
  }
}
