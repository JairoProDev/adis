import { PrismaService } from '@/common/services/prisma.service';
export declare class ChatService {
    private prisma;
    constructor(prisma: PrismaService);
    createConversation(participantIds: string[], listingId?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ConversationStatus;
        listingId: string | null;
        lastMessageAt: Date | null;
    }>;
    getConversations(userId: string): Promise<({
        listing: {
            id: string;
            slug: string;
            title: string;
        } | null;
        messages: {
            id: string;
            createdAt: Date;
            content: string;
            attachments: string[];
            read: boolean;
            readAt: Date | null;
            conversationId: string;
            senderId: string;
        }[];
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
    })[]>;
    getConversation(conversationId: string, userId: string): Promise<{
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
    }>;
    sendMessage(conversationId: string, senderId: string, content: string, attachments?: string[]): Promise<{
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
    }>;
    markMessagesAsRead(conversationId: string, userId: string): Promise<void>;
    getUnreadCount(userId: string): Promise<number>;
}
//# sourceMappingURL=chat.service.d.ts.map