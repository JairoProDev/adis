"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EmbeddingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmbeddingService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let EmbeddingService = EmbeddingService_1 = class EmbeddingService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(EmbeddingService_1.name);
        this.apiKey = this.configService.get('GROQ_API_KEY') || '';
    }
    /**
     * Generate embedding vector for text using simple approach
     * In production, you'd use OpenAI embeddings or similar
     * For MVP, we'll use a simple hash-based approach
     */
    async generateEmbedding(text) {
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
    simpleHash(str) {
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
    cosineSimilarity(vectorA, vectorB) {
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
};
exports.EmbeddingService = EmbeddingService;
exports.EmbeddingService = EmbeddingService = EmbeddingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmbeddingService);
//# sourceMappingURL=embedding.service.js.map