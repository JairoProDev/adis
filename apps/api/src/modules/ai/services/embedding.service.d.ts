import { ConfigService } from '@nestjs/config';
export declare class EmbeddingService {
    private configService;
    private readonly logger;
    private readonly apiKey;
    constructor(configService: ConfigService);
    /**
     * Generate embedding vector for text using simple approach
     * In production, you'd use OpenAI embeddings or similar
     * For MVP, we'll use a simple hash-based approach
     */
    generateEmbedding(text: string): Promise<number[]>;
    private simpleHash;
    /**
     * Calculate cosine similarity between two vectors
     */
    cosineSimilarity(vectorA: number[], vectorB: number[]): number;
}
//# sourceMappingURL=embedding.service.d.ts.map