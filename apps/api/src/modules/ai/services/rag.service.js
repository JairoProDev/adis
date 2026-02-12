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
var RAGService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RAGService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../common/services/prisma.service");
const embedding_service_1 = require("./embedding.service");
let RAGService = RAGService_1 = class RAGService {
    constructor(prisma, embeddingService) {
        this.prisma = prisma;
        this.embeddingService = embeddingService;
        this.logger = new common_1.Logger(RAGService_1.name);
    }
    /**
     * Search knowledge base using semantic search
     */
    async searchKnowledgeBase(businessId, query, limit = 5) {
        // Generate query embedding
        const queryEmbedding = await this.embeddingService.generateEmbedding(query);
        // For MVP: Use SQL with pgvector for semantic search
        // In production, this would use proper vector similarity search
        const results = await this.prisma.$queryRaw `
      SELECT
        id,
        question,
        answer,
        1 - (embedding <=> ${JSON.stringify(queryEmbedding)}::vector) as score
      FROM "BusinessKnowledgeBase"
      WHERE business_id = ${businessId}
        AND active = true
      ORDER BY embedding <=> ${JSON.stringify(queryEmbedding)}::vector
      LIMIT ${limit}
    `;
        return results.map((r) => ({
            id: r.id,
            question: r.question,
            answer: r.answer,
            score: r.score || 0,
        }));
    }
    /**
     * Add knowledge base entry with embedding
     */
    async addKnowledgeBase(businessId, question, answer, category) {
        // Generate embedding for the Q&A pair
        const text = `${question} ${answer}`;
        const embedding = await this.embeddingService.generateEmbedding(text);
        return this.prisma.$executeRaw `
      INSERT INTO "BusinessKnowledgeBase"
        (id, business_id, question, answer, category, embedding, active, created_at, updated_at)
      VALUES (
        gen_random_uuid(),
        ${businessId},
        ${question},
        ${answer},
        ${category || null},
        ${JSON.stringify(embedding)}::vector,
        true,
        NOW(),
        NOW()
      )
    `;
    }
    /**
     * Build context from search results
     */
    buildContext(results) {
        if (results.length === 0) {
            return 'No hay información disponible en la base de conocimientos.';
        }
        const context = results
            .map((r, idx) => {
            return `[${idx + 1}] ${r.question}\n${r.answer}`;
        })
            .join('\n\n');
        return `Base de conocimientos relevante:\n\n${context}`;
    }
    /**
     * Auto-generate knowledge base from business data
     */
    async autoGenerateKnowledgeBase(businessId) {
        const business = await this.prisma.business.findUnique({
            where: { id: businessId },
            include: {
                businessHours: true,
                socialLinks: true,
            },
        });
        if (!business) {
            throw new Error('Business not found');
        }
        const entries = [];
        // Contact information
        if (business.phone) {
            entries.push({
                question: '¿Cuál es el teléfono de contacto?',
                answer: `El teléfono es ${business.phone}`,
                category: 'contacto',
            });
        }
        if (business.email) {
            entries.push({
                question: '¿Cuál es el email de contacto?',
                answer: `El email es ${business.email}`,
                category: 'contacto',
            });
        }
        if (business.whatsapp) {
            entries.push({
                question: '¿Tienen WhatsApp?',
                answer: `Sí, puedes contactarnos por WhatsApp al ${business.whatsapp}`,
                category: 'contacto',
            });
        }
        // Location
        if (business.address) {
            entries.push({
                question: '¿Dónde están ubicados?',
                answer: `Estamos ubicados en ${business.address}, ${business.city}, ${business.country}`,
                category: 'ubicacion',
            });
        }
        // Business hours
        if (business.businessHours && business.businessHours.length > 0) {
            const hours = business.businessHours
                .map((h) => {
                const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
                return `${days[h.dayOfWeek]}: ${h.closed ? 'Cerrado' : `${h.openTime} - ${h.closeTime}`}`;
            })
                .join(', ');
            entries.push({
                question: '¿Cuál es el horario de atención?',
                answer: `Nuestro horario es: ${hours}`,
                category: 'horario',
            });
        }
        // Description
        if (business.description) {
            entries.push({
                question: `¿Qué es ${business.name}?`,
                answer: business.description,
                category: 'informacion',
            });
        }
        // Add all entries
        for (const entry of entries) {
            await this.addKnowledgeBase(businessId, entry.question, entry.answer, entry.category);
        }
        this.logger.log(`Auto-generated ${entries.length} KB entries for business ${businessId}`);
        return entries.length;
    }
};
exports.RAGService = RAGService;
exports.RAGService = RAGService = RAGService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        embedding_service_1.EmbeddingService])
], RAGService);
//# sourceMappingURL=rag.service.js.map