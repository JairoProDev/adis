import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from '../chat.service';
interface AuthenticatedSocket extends Socket {
    user?: {
        id: string;
        email: string;
    };
}
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private chatService;
    server: Server;
    private logger;
    private userSockets;
    constructor(chatService: ChatService);
    handleConnection(client: AuthenticatedSocket): Promise<void>;
    handleDisconnect(client: AuthenticatedSocket): void;
    handleJoinConversation(client: AuthenticatedSocket, data: {
        conversationId: string;
    }): Promise<{
        success: boolean;
        conversation: {
            listing: {
                id: string;
                tenantId: string;
                metadata: import("@prisma/client/runtime/library").JsonValue;
                createdAt: Date;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.ListingStatus;
                slug: string;
                description: string;
                city: string | null;
                state: string | null;
                country: string;
                latitude: number | null;
                longitude: number | null;
                featured: boolean;
                metaTitle: string | null;
                metaDescription: string | null;
                viewCount: number;
                clickCount: number;
                title: string;
                categoryId: string;
                businessId: string | null;
                userId: string;
                price: number | null;
                priceType: import(".prisma/client").$Enums.PriceType;
                currency: string;
                negotiable: boolean;
                location: string | null;
                shareCount: number;
                expiresAt: Date | null;
                publishedAt: Date | null;
            } | null;
            messages: ({
                sender: {
                    firstName: string | null;
                    lastName: string | null;
                    id: string;
                    avatar: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                content: string;
                attachments: string[];
                read: boolean;
                readAt: Date | null;
                conversationId: string;
                senderId: string;
            })[];
            participants: {
                firstName: string | null;
                lastName: string | null;
                id: string;
                avatar: string | null;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.ConversationStatus;
            listingId: string | null;
            lastMessageAt: Date | null;
        };
        error?: undefined;
    } | {
        error: any;
        success?: undefined;
        conversation?: undefined;
    }>;
    handleLeaveConversation(client: AuthenticatedSocket, data: {
        conversationId: string;
    }): Promise<{
        success: boolean;
    }>;
    handleSendMessage(client: AuthenticatedSocket, data: {
        conversationId: string;
        content: string;
        attachments?: string[];
    }): Promise<{
        success: boolean;
        message: {
            sender: {
                firstName: string | null;
                lastName: string | null;
                id: string;
                avatar: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            content: string;
            attachments: string[];
            read: boolean;
            readAt: Date | null;
            conversationId: string;
            senderId: string;
        };
        error?: undefined;
    } | {
        error: any;
        success?: undefined;
        message?: undefined;
    }>;
    handleTyping(client: AuthenticatedSocket, data: {
        conversationId: string;
        isTyping: boolean;
    }): Promise<void>;
    handleMarkAsRead(client: AuthenticatedSocket, data: {
        conversationId: string;
    }): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        error: any;
        success?: undefined;
    }>;
    sendNotificationToUser(userId: string, event: string, data: any): void;
}
export {};
//# sourceMappingURL=chat.gateway.d.ts.map