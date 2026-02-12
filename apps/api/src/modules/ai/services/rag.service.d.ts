import { PrismaService } from '@/common/services/prisma.service';
import { EmbeddingService } from './embedding.service';
interface SearchResult {
    id: string;
    question: string;
    answer: string;
    score: number;
}
export declare class RAGService {
    private prisma;
    private embeddingService;
    private readonly logger;
    constructor(prisma: PrismaService, embeddingService: EmbeddingService);
    /**
     * Search knowledge base using semantic search
     */
    searchKnowledgeBase(businessId: string, query: string, limit?: number): Promise<SearchResult[]>;
    /**
     * Add knowledge base entry with embedding
     */
    addKnowledgeBase(businessId: string, question: string, answer: string, category?: string): Promise<any>;
    /**
     * Build context from search results
     */
    buildContext(results: SearchResult[]): string;
    /**
     * Auto-generate knowledge base from business data
     */
    autoGenerateKnowledgeBase(businessId: string): Promise<number>;
}
export {};
//# sourceMappingURL=rag.service.d.ts.map