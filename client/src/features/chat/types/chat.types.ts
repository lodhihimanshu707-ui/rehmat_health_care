export interface ChatUser {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  consultationId?: string;
  text: string;
  isRead: boolean;
  createdAt: string;
  sender?: ChatUser;
  receiver?: ChatUser;
}

