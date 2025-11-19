'use client';

import { useEffect, useState, useCallback } from 'react';
import { connectSocket, disconnectSocket, getSocket } from '../socket/client';
import type { Socket } from 'socket.io-client';

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  attachments?: string[];
  read: boolean;
  createdAt: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

interface Conversation {
  id: string;
  participants: Array<{
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  }>;
  listing?: {
    id: string;
    title: string;
    slug: string;
  };
  messages: Message[];
  lastMessageAt?: string;
}

export function useChat(userId?: string, token?: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});

  // Connect socket
  useEffect(() => {
    if (!userId || !token) return;

    const newSocket = connectSocket(userId, token);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
    });

    newSocket.on('unread_count', ({ count }: { count: number }) => {
      setUnreadCount(count);
    });

    newSocket.on('new_message', (message: Message) => {
      // Add message to active conversation if it matches
      if (activeConversation?.id === message.conversationId) {
        setActiveConversation((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: [...prev.messages, message],
          };
        });
      }

      // Update conversations list
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === message.conversationId
            ? { ...conv, messages: [message], lastMessageAt: message.createdAt }
            : conv,
        ),
      );

      // Play notification sound (optional)
      if (message.senderId !== userId) {
        playNotificationSound();
      }
    });

    newSocket.on('user_typing', ({ userId: typingUserId, isTyping }: { userId: string; isTyping: boolean }) => {
      setTypingUsers((prev) => ({
        ...prev,
        [typingUserId]: isTyping,
      }));

      // Clear typing after 3 seconds
      if (isTyping) {
        setTimeout(() => {
          setTypingUsers((prev) => ({
            ...prev,
            [typingUserId]: false,
          }));
        }, 3000);
      }
    });

    newSocket.on('messages_read', ({ userId: readerId }: { userId: string; conversationId: string }) => {
      if (readerId !== userId && activeConversation) {
        // Mark messages as read in UI
        setActiveConversation((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: prev.messages.map((msg) =>
              msg.senderId === userId ? { ...msg, read: true, readAt: new Date().toISOString() } : msg,
            ),
          };
        });
      }
    });

    return () => {
      disconnectSocket();
      setSocket(null);
      setConnected(false);
    };
  }, [userId, token]);

  const joinConversation = useCallback(
    (conversationId: string) => {
      if (!socket) return;

      socket.emit('join_conversation', { conversationId }, (response: any) => {
        if (response.conversation) {
          setActiveConversation(response.conversation);
        }
      });
    },
    [socket],
  );

  const leaveConversation = useCallback(() => {
    if (!socket || !activeConversation) return;

    socket.emit('leave_conversation', { conversationId: activeConversation.id });
    setActiveConversation(null);
  }, [socket, activeConversation]);

  const sendMessage = useCallback(
    (content: string, attachments?: string[]) => {
      if (!socket || !activeConversation) return;

      socket.emit(
        'send_message',
        {
          conversationId: activeConversation.id,
          content,
          attachments,
        },
        (response: any) => {
          if (response.error) {
            console.error('Send message error:', response.error);
          }
        },
      );
    },
    [socket, activeConversation],
  );

  const sendTyping = useCallback(
    (isTyping: boolean) => {
      if (!socket || !activeConversation) return;

      socket.emit('typing', {
        conversationId: activeConversation.id,
        isTyping,
      });
    },
    [socket, activeConversation],
  );

  const markAsRead = useCallback(() => {
    if (!socket || !activeConversation) return;

    socket.emit('mark_as_read', { conversationId: activeConversation.id });
  }, [socket, activeConversation]);

  return {
    connected,
    conversations,
    activeConversation,
    unreadCount,
    typingUsers,
    joinConversation,
    leaveConversation,
    sendMessage,
    sendTyping,
    markAsRead,
  };
}

function playNotificationSound() {
  // Optional: Play notification sound
  try {
    const audio = new Audio('/sounds/notification.mp3');
    audio.play().catch(() => {
      // Ignore errors (browser may block autoplay)
    });
  } catch (error) {
    // Ignore errors
  }
}
