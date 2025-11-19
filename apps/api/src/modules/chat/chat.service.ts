import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/common/services/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createConversation(
    participantIds: string[],
    listingId?: string,
  ) {
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

  async getConversations(userId: string) {
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

  async getConversation(conversationId: string, userId: string) {
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
      throw new NotFoundException('Conversation not found');
    }

    // Check if user is participant
    const isParticipant = conversation.participants.some((p) => p.id === userId);
    if (!isParticipant) {
      throw new ForbiddenException('Not a participant');
    }

    // Mark messages as read
    await this.markMessagesAsRead(conversationId, userId);

    return conversation;
  }

  async sendMessage(
    conversationId: string,
    senderId: string,
    content: string,
    attachments?: string[],
  ) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { participants: true },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const isParticipant = conversation.participants.some((p) => p.id === senderId);
    if (!isParticipant) {
      throw new ForbiddenException('Not a participant');
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

  async markMessagesAsRead(conversationId: string, userId: string) {
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

  async getUnreadCount(userId: string): Promise<number> {
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
}
