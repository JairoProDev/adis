import { AIService } from './ai.service';
import { RAGService } from './services/rag.service';
import { ChatInput, GenerateDescriptionInput, GenerateListingDescriptionInput, AddKnowledgeBaseInput, SearchKnowledgeBaseInput, AutoGenerateKBInput, SuggestKBInput, SearchResult, KnowledgeBaseSuggestion } from './dto/ai.input';
export declare class AIResolver {
    private aiService;
    private ragService;
    constructor(aiService: AIService, ragService: RAGService);
    /**
     * Chat with ADIS AI (public - no auth required)
     */
    aiChat(input: ChatInput): Promise<string>;
    /**
     * Generate business description using AI
     */
    aiGenerateBusinessDescription(input: GenerateDescriptionInput): Promise<string>;
    /**
     * Generate listing description using AI
     */
    aiGenerateListingDescription(input: GenerateListingDescriptionInput): Promise<string>;
    /**
     * Add entry to knowledge base
     */
    aiAddKnowledgeBase(user: any, input: AddKnowledgeBaseInput): Promise<boolean>;
    /**
     * Search knowledge base (for testing/admin)
     */
    aiSearchKnowledgeBase(input: SearchKnowledgeBaseInput): Promise<SearchResult[]>;
    /**
     * Auto-generate knowledge base from business data
     */
    aiAutoGenerateKnowledgeBase(user: any, input: AutoGenerateKBInput): Promise<number>;
    /**
     * Suggest knowledge base entries using AI
     */
    aiSuggestKnowledgeBase(input: SuggestKBInput): Promise<KnowledgeBaseSuggestion[]>;
    /**
     * Validate Groq API key (admin only)
     */
    aiValidateApiKey(user: any): Promise<boolean>;
}
//# sourceMappingURL=ai.resolver.d.ts.map