"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("@publicadis/database");
let PrismaService = class PrismaService {
    constructor() {
        // Use the singleton from @publicadis/database
        this.client = database_1.prisma;
        // ... expose other models as needed
    }
    async onModuleInit() {
        await this.client.$connect();
        console.log('✅ Database connected');
    }
    async onModuleDestroy() {
        await this.client.$disconnect();
    }
    // Expose all Prisma client methods
    get user() {
        return this.client.user;
    }
    get business() {
        return this.client.business;
    }
    get listing() {
        return this.client.listing;
    }
    get category() {
        return this.client.category;
    }
    get tenant() {
        return this.client.tenant;
    }
    get subscription() {
        return this.client.subscription;
    }
    get transaction() {
        return this.client.transaction;
    }
    get conversation() {
        return this.client.conversation;
    }
    get message() {
        return this.client.message;
    }
    get review() {
        return this.client.review;
    }
    get chatSession() {
        return this.client.chatSession;
    }
    get adCampaign() {
        return this.client.adCampaign;
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)()
], PrismaService);
//# sourceMappingURL=prisma.service.js.map