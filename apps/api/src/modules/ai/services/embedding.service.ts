import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmbeddingService {
  private readonly logger = new Logger(EmbeddingService.name);
  private readonly apiKey: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('GROQ_API_KEY') || '';
  }

  /**
   * Generate embedding vector for text using simple approach
   * In production, you'd use OpenAI embeddings or similar
   * For MVP, we'll use a simple hash-based approach
   */
  async generateEmbedding(text: string): Promise<number[]> {
    // Simple embedding: normalize text and create a 1536-dim vector
    // In production, use: OpenAI text-embedding-3-small or similar

    const normalized = text.toLowerCase().trim();
    const words = normalized.split(/\s+/);

    // Create a simple TF-IDF-like vector (1536 dimensions for pgvector compatibility)
    const vector = new Array(1536).fill(0);

    // Use word hashes to populate vector
    words.forEach((word, idx) => {
      const hash = this.simpleHash(word);
      const position = hash % 1536;
      vector[position] += 1 / (idx + 1); // Weight by position
    });

    // Normalize vector
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return vector.map((val) => (magnitude > 0 ? val / magnitude : 0));
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  cosineSimilarity(vectorA: number[], vectorB: number[]): number {
    if (vectorA.length !== vectorB.length) {
      throw new Error('Vectors must have same dimension');
    }

    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < vectorA.length; i++) {
      dotProduct += vectorA[i] * vectorB[i];
      magnitudeA += vectorA[i] * vectorA[i];
      magnitudeB += vectorB[i] * vectorB[i];
    }

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    if (magnitudeA === 0 || magnitudeB === 0) {
      return 0;
    }

    return dotProduct / (magnitudeA * magnitudeB);
  }
}
