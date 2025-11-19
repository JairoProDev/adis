import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { ChatService } from '../chat.service';
import { WsJwtGuard } from '@/common/guards/ws-jwt.guard';

interface AuthenticatedSocket extends Socket {
  user?: {
    id: string;
    email: string;
  };
}

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: 'chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('ChatGateway');
  private userSockets = new Map<string, string>(); // userId -> socketId

  constructor(private chatService: ChatService) {}

  async handleConnection(client: AuthenticatedSocket) {
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

    } catch (error) {
      this.logger.error('Connection error:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.user) {
      this.userSockets.delete(client.user.id);
      this.logger.log(`Client disconnected: ${client.id} (User: ${client.user.id})`);
    }
  }

  @SubscribeMessage('join_conversation')
  async handleJoinConversation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    const { conversationId } = data;

    if (!client.user) {
      return { error: 'Not authenticated' };
    }

    try {
      const conversation = await this.chatService.getConversation(
        conversationId,
        client.user.id,
      );

      client.join(conversationId);

      this.logger.log(
        `User ${client.user.id} joined conversation ${conversationId}`,
      );

      return { success: true, conversation };
    } catch (error) {
      this.logger.error('Join conversation error:', error);
      return { error: error.message };
    }
  }

  @SubscribeMessage('leave_conversation')
  async handleLeaveConversation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    const { conversationId } = data;
    client.leave(conversationId);

    this.logger.log(
      `User ${client.user?.id} left conversation ${conversationId}`,
    );

    return { success: true };
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody()
    data: {
      conversationId: string;
      content: string;
      attachments?: string[];
    },
  ) {
    const { conversationId, content, attachments } = data;

    if (!client.user) {
      return { error: 'Not authenticated' };
    }

    try {
      const message = await this.chatService.sendMessage(
        conversationId,
        client.user.id,
        content,
        attachments,
      );

      // Emit to all clients in the conversation room
      this.server.to(conversationId).emit('new_message', message);

      this.logger.log(
        `Message sent in conversation ${conversationId} by user ${client.user.id}`,
      );

      return { success: true, message };
    } catch (error) {
      this.logger.error('Send message error:', error);
      return { error: error.message };
    }
  }

  @SubscribeMessage('typing')
  async handleTyping(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string; isTyping: boolean },
  ) {
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

  @SubscribeMessage('mark_as_read')
  async handleMarkAsRead(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string },
  ) {
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
    } catch (error) {
      this.logger.error('Mark as read error:', error);
      return { error: error.message };
    }
  }

  // Helper method to send notification to specific user
  sendNotificationToUser(userId: string, event: string, data: any) {
    const socketId = this.userSockets.get(userId);
    if (socketId) {
      this.server.to(socketId).emit(event, data);
    }
  }
}
