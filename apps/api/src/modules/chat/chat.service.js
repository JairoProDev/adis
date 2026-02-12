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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/services/prisma.service");
let ChatService = class ChatService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createConversation(participantIds, listingId) {
        // Check if conversation already exists
        const existing = await this.prisma.conversation.findFirst({
            where: {
                AND: [
                    { participants: { some: { id: participantIds[0] } } },
                    { participants: { some: { id: participantIds[1] } } },
                    { listingId: listingId || null },
                ],
            },
        });
        if (existing) {
            return existing;
        }
        return this.prisma.conversation.create({
            data: {
                listingId,
                participants: {
                    connect: participantIds.map((id) => ({ id })),
                },
            },
            include: {
                participants: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
                listing: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                    },
                },
            },
        });
    }
    async getConversations(userId) {
        return this.prisma.conversation.findMany({
            where: {
                participants: {
                    some: { id: userId },
                },
                status: 'ACTIVE',
            },
            include: {
                participants: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
                listing: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                    },
                },
                messages: {
                    take: 1,
                    orderBy: { createdAt: 'desc' },
                },
            },
            orderBy: {
                lastMessageAt: 'desc',
            },
        });
    }
    async getConversation(conversationId, userId) {
        const conversation = await this.prisma.conversation.findUnique({
            where: { id: conversationId },
            include: {
                participants: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
                listing: true,
                messages: {
                    orderBy: { createdAt: 'asc' },
                    include: {
                        sender: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                avatar: true,
                            },
                        },
                    },
                },
            },
        });
        if (!conversation) {
            throw new common_1.NotFoundException('Conversation not found');
        }
        // Check if user is participant
        const isParticipant = conversation.participants.some((p) => p.id === userId);
        if (!isParticipant) {
            throw new common_1.ForbiddenException('Not a participant');
        }
        // Mark messages as read
        await this.markMessagesAsRead(conversationId, userId);
        return conversation;
    }
    async sendMessage(conversationId, senderId, content, attachments) {
        const conversation = await this.prisma.conversation.findUnique({
            where: { id: conversationId },
            include: { participants: true },
        });
        if (!conversation) {
            throw new common_1.NotFoundException('Conversation not found');
        }
        const isParticipant = conversation.participants.some((p) => p.id === senderId);
        if (!isParticipant) {
            throw new common_1.ForbiddenException('Not a participant');
        }
        const message = await this.prisma.message.create({
            data: {
                conversationId,
                senderId,
                content,
                attachments: attachments || [],
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
            },
        });
        // Update conversation lastMessageAt
        await this.prisma.conversation.update({
            where: { id: conversationId },
            data: { lastMessageAt: new Date() },
        });
        return message;
    }
    async markMessagesAsRead(conversationId, userId) {
        await this.prisma.message.updateMany({
            where: {
                conversationId,
                senderId: { not: userId },
                read: false,
            },
            data: {
                read: true,
                readAt: new Date(),
            },
        });
    }
    async getUnreadCount(userId) {
        const conversations = await this.prisma.conversation.findMany({
            where: {
                participants: {
                    some: { id: userId },
                },
            },
            select: { id: true },
        });
        const conversationIds = conversations.map((c) => c.id);
        return this.prisma.message.count({
            where: {
                conversationId: { in: conversationIds },
                senderId: { not: userId },
                read: false,
            },
        });
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChatService);
//# sourceMappingURL=chat.service.js.map