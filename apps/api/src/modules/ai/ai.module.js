"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ai_service_1 = require("./ai.service");
const embedding_service_1 = require("./services/embedding.service");
const rag_service_1 = require("./services/rag.service");
const ai_resolver_1 = require("./ai.resolver");
const prisma_service_1 = require("../../common/services/prisma.service");
let AIModule = class AIModule {
};
exports.AIModule = AIModule;
exports.AIModule = AIModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        providers: [
            ai_service_1.AIService,
            embedding_service_1.EmbeddingService,
            rag_service_1.RAGService,
            ai_resolver_1.AIResolver,
            prisma_service_1.PrismaService,
        ],
        exports: [ai_service_1.AIService, embedding_service_1.EmbeddingService, rag_service_1.RAGService],
    })
], AIModule);
//# sourceMappingURL=ai.module.js.map