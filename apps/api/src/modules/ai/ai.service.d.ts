import { ConfigService } from '@nestjs/config';
import { RAGService } from './services/rag.service';
interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
export declare class AIService {
    private configService;
    private ragService;
    private readonly logger;
    private readonly apiKey;
    private readonly apiUrl;
    private readonly model;
    constructor(configService: ConfigService, ragService: RAGService);
    /**
     * Chat with ADIS AI using RAG context
     */
    chat(businessId: string, userMessage: string, conversationHistory?: ChatMessage[]): Promise<string>;
    /**
     * Generate business description using AI
     */
    generateBusinessDescription(businessName: string, category: string, keywords?: string[]): Promise<string>;
    /**
     * Generate listing description using AI
     */
    generateListingDescription(title: string, category: string, price?: number, features?: string[]): Promise<string>;
    /**
     * Suggest knowledge base entries from business data
     */
    suggestKnowledgeBase(businessName: string, description: string, category: string): Promise<Array<{
        question: string;
        answer: string;
        category: string;
    }>>;
    /**
     * Build system prompt with RAG context
     */
    private buildSystemPrompt;
    /**
     * Call Groq API
     */
    private callGroqAPI;
    /**
     * Validate API key
     */
    validateApiKey(): Promise<boolean>;
}
export {};
//# sourceMappingURL=ai.service.d.ts.map