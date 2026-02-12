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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const ai_service_1 = require("./ai.service");
const rag_service_1 = require("./services/rag.service");
const ai_input_1 = require("./dto/ai.input");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let AIResolver = class AIResolver {
    constructor(aiService, ragService) {
        this.aiService = aiService;
        this.ragService = ragService;
    }
    /**
     * Chat with ADIS AI (public - no auth required)
     */
    async aiChat(input) {
        return this.aiService.chat(input.businessId, input.message, input.conversationHistory || []);
    }
    /**
     * Generate business description using AI
     */
    async aiGenerateBusinessDescription(input) {
        return this.aiService.generateBusinessDescription(input.businessName, input.category, input.keywords);
    }
    /**
     * Generate listing description using AI
     */
    async aiGenerateListingDescription(input) {
        return this.aiService.generateListingDescription(input.title, input.category, input.price, input.features);
    }
    /**
     * Add entry to knowledge base
     */
    async aiAddKnowledgeBase(user, input) {
        // TODO: Verify user owns the business
        await this.ragService.addKnowledgeBase(input.businessId, input.question, input.answer, input.category);
        return true;
    }
    /**
     * Search knowledge base (for testing/admin)
     */
    async aiSearchKnowledgeBase(input) {
        return this.ragService.searchKnowledgeBase(input.businessId, input.query, input.limit || 5);
    }
    /**
     * Auto-generate knowledge base from business data
     */
    async aiAutoGenerateKnowledgeBase(user, input) {
        // TODO: Verify user owns the business
        return this.ragService.autoGenerateKnowledgeBase(input.businessId);
    }
    /**
     * Suggest knowledge base entries using AI
     */
    async aiSuggestKnowledgeBase(input) {
        return this.aiService.suggestKnowledgeBase(input.businessName, input.description, input.category);
    }
    /**
     * Validate Groq API key (admin only)
     */
    async aiValidateApiKey(user) {
        // TODO: Add admin guard
        return this.aiService.validateApiKey();
    }
};
exports.AIResolver = AIResolver;
__decorate([
    (0, graphql_1.Mutation)(() => String),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ai_input_1.ChatInput]),
    __metadata("design:returntype", Promise)
], AIResolver.prototype, "aiChat", null);
__decorate([
    (0, graphql_1.Mutation)(() => String),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ai_input_1.GenerateDescriptionInput]),
    __metadata("design:returntype", Promise)
], AIResolver.prototype, "aiGenerateBusinessDescription", null);
__decorate([
    (0, graphql_1.Mutation)(() => String),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ai_input_1.GenerateListingDescriptionInput]),
    __metadata("design:returntype", Promise)
], AIResolver.prototype, "aiGenerateListingDescription", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ai_input_1.AddKnowledgeBaseInput]),
    __metadata("design:returntype", Promise)
], AIResolver.prototype, "aiAddKnowledgeBase", null);
__decorate([
    (0, graphql_1.Query)(() => [ai_input_1.SearchResult]),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ai_input_1.SearchKnowledgeBaseInput]),
    __metadata("design:returntype", Promise)
], AIResolver.prototype, "aiSearchKnowledgeBase", null);
__decorate([
    (0, graphql_1.Mutation)(() => graphql_1.Int),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ai_input_1.AutoGenerateKBInput]),
    __metadata("design:returntype", Promise)
], AIResolver.prototype, "aiAutoGenerateKnowledgeBase", null);
__decorate([
    (0, graphql_1.Mutation)(() => [ai_input_1.KnowledgeBaseSuggestion]),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ai_input_1.SuggestKBInput]),
    __metadata("design:returntype", Promise)
], AIResolver.prototype, "aiSuggestKnowledgeBase", null);
__decorate([
    (0, graphql_1.Query)(() => Boolean),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AIResolver.prototype, "aiValidateApiKey", null);
exports.AIResolver = AIResolver = __decorate([
    (0, graphql_1.Resolver)('AI'),
    __metadata("design:paramtypes", [ai_service_1.AIService,
        rag_service_1.RAGService])
], AIResolver);
//# sourceMappingURL=ai.resolver.js.map