export interface UserMessage {
  id: string;
  name: string;
  avatar: string;
  role?: string;
  location?: string;
  timezone?: string;
  lastSeen: string;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isRead?: boolean;
  readAt?: string;
}

export interface Conversation {
  id: string;
  user: UserMessage;
  lastMessage: string;
  lastMessageTime: string;
  messages: Message[];
  photos?: string[];
  files?: string[];
}
