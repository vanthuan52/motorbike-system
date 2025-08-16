import { ApiResponse, ApiResponsePagination } from "@/types/api.type";
import { BaseEntity, PaginationQuery } from "@/types/base.type";

export enum ENUM_CHAT_GW_EVENTS {
  JOIN_CONVERSATION = "joinConversation",
  SEND_MESSAGE = "sendMessage",
  READ_MESSAGE = "readMessage",
  TYPING = "typing",

  JOINED_CONVERSATION = "joinedConversation",
  NEW_MESSAGE = "newMessage",
  TYPING_STATUS = "typingStatus",
  MESSAGE_READ = "messageRead",
  USER_STATUS = "userStatus",
  ERROR = "error",
}

export enum ENUM_MESSAGE_TYPE {
  TEXT = "text",
  IMAGE = "image",
  FILE = "file",
}

export enum ENUM_MESSAGE_STATUS {
  SENT = "sent",
  DELIVERED = "delivered",
  READ = "read",
}

export interface MessagePaginationQuery extends PaginationQuery {}

export interface Message extends BaseEntity {
  conversation: Conversation;
  sender: string;
  receiver: string;
  content: string;
  type: ENUM_MESSAGE_TYPE;
  timestamp: Date;
  status: ENUM_MESSAGE_STATUS;
  readBy?: string[];
}

export type MessageSocket = {
  _id?: string;
  sender: string; // 'user' | 'bot' | userId
  text: string;
  createdAt?: string;
};

export interface GetMessageSuccessPayload {
  messages: Message[];
  pagination: ApiResponsePagination;
}

export interface Conversation extends BaseEntity {
  participants: {
    _id: string;
    username: string;
    name: string;
    email: string;
    avatar?: string;
  }[];
  lastMessage?: Message;
}

export type ConversationResponse = ApiResponse<Conversation[]>;
export type ConversationCreateResponse = ApiResponse<Conversation["_id"]>;
export interface ConversationGetResponse extends ApiResponse<Conversation[]> {}
export type MessageResponse = ApiResponse<Message>;
export type ListMessageResponse = ApiResponse<Message[]>;

export interface MarkAsReadPayload {
  conversationId: string;
  messageIds: string[];
}

export interface ListMessagesPayload {
  conversationId: string;
}
