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
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const chat_service_1 = require("../chat.service");
let ChatGateway = class ChatGateway {
    constructor(chatService) {
        this.chatService = chatService;
        this.logger = new common_1.Logger('ChatGateway');
        this.userSockets = new Map(); // userId -> socketId
    }
    async handleConnection(client) {
        try {
            // Extract token from handshake (sent from client)
            const token = client.handshake.auth?.token;
            if (!token) {
                client.disconnect();
                return;
            }
            // In production, verify JWT token here
            // For now, we'll accept the userId from client
            const userId = client.handshake.auth?.userId;
            if (!userId) {
                client.disconnect();
                return;
            }
            client.user = { id: userId, email: '' };
            this.userSockets.set(userId, client.id);
            this.logger.log(`Client connected: ${client.id} (User: ${userId})`);
            // Send unread count
            const unreadCount = await this.chatService.getUnreadCount(userId);
            client.emit('unread_count', { count: unreadCount });
        }
        catch (error) {
            this.logger.error('Connection error:', error);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        if (client.user) {
            this.userSockets.delete(client.user.id);
            this.logger.log(`Client disconnected: ${client.id} (User: ${client.user.id})`);
        }
    }
    async handleJoinConversation(client, data) {
        const { conversationId } = data;
        if (!client.user) {
            return { error: 'Not authenticated' };
        }
        try {
            const conversation = await this.chatService.getConversation(conversationId, client.user.id);
            client.join(conversationId);
            this.logger.log(`User ${client.user.id} joined conversation ${conversationId}`);
            return { success: true, conversation };
        }
        catch (error) {
            this.logger.error('Join conversation error:', error);
            return { error: error.message };
        }
    }
    async handleLeaveConversation(client, data) {
        const { conversationId } = data;
        client.leave(conversationId);
        this.logger.log(`User ${client.user?.id} left conversation ${conversationId}`);
        return { success: true };
    }
    async handleSendMessage(client, data) {
        const { conversationId, content, attachments } = data;
        if (!client.user) {
            return { error: 'Not authenticated' };
        }
        try {
            const message = await this.chatService.sendMessage(conversationId, client.user.id, content, attachments);
            // Emit to all clients in the conversation room
            this.server.to(conversationId).emit('new_message', message);
            this.logger.log(`Message sent in conversation ${conversationId} by user ${client.user.id}`);
            return { success: true, message };
        }
        catch (error) {
            this.logger.error('Send message error:', error);
            return { error: error.message };
        }
    }
    async handleTyping(client, data) {
        const { conversationId, isTyping } = data;
        if (!client.user) {
            return;
        }
        // Broadcast to other participants (exclude sender)
        client.to(conversationId).emit('user_typing', {
            userId: client.user.id,
            isTyping,
        });
    }
    async handleMarkAsRead(client, data) {
        const { conversationId } = data;
        if (!client.user) {
            return { error: 'Not authenticated' };
        }
        try {
            await this.chatService.markMessagesAsRead(conversationId, client.user.id);
            // Notify other participants
            client.to(conversationId).emit('messages_read', {
                userId: client.user.id,
                conversationId,
            });
            return { success: true };
        }
        catch (error) {
            this.logger.error('Mark as read error:', error);
            return { error: error.message };
        }
    }
    // Helper method to send notification to specific user
    sendNotificationToUser(userId, event, data) {
        const socketId = this.userSockets.get(userId);
        if (socketId) {
            this.server.to(socketId).emit(event, data);
        }
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join_conversation'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleJoinConversation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave_conversation'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleLeaveConversation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('send_message'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleSendMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleTyping", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('mark_as_read'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMarkAsRead", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
            credentials: true,
        },
        namespace: 'chat',
    }),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map