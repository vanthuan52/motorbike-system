import { AxiosError, AxiosResponse } from "axios";
import { sharedApi } from "@/lib/axios";
import {
  ConversationCreateResponse,
  ConversationGetResponse,
  ENUM_MESSAGE_STATUS,
  MessagePaginationQuery,
} from "./types";
import { ApiErrorResponse } from "@/types/api.type";
import { User } from "../user/types";
import { API_ENDPOINTS } from "@/constants/api-endpoint";

const chatService = {
  createConversation: async (
    senderId: User["_id"],
    receiverId: User["_id"]
  ): Promise<ConversationCreateResponse> => {
    try {
      const response: AxiosResponse<ConversationCreateResponse> =
        await sharedApi.post(API_ENDPOINTS.SHARED.CONVERSATION_CREATE, {
          sender: senderId,
          receiver: receiverId,
        });

      if (response.status === 200 && response.data) {
        return response.data;
      } else {
        throw new Error(response.data.message || "Create conversation failed.");
      }
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },

  getConversation: async () => {
    try {
      const response = await sharedApi.get<ConversationGetResponse>(
        API_ENDPOINTS.SHARED.CONVERSATION_GET
      );
      if (response.status === 200 && response.data.data) {
        return response.data;
      } else {
        throw new Error(response.data.message || "Get conversation failed.");
      }
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },

  listMessageByConversation: async (
    conversationId: string,
    queries?: MessagePaginationQuery
  ) => {
    try {
      const response = await sharedApi.get<ConversationGetResponse>(
        API_ENDPOINTS.SHARED.MESSAGE_BY_CONVERSATION(conversationId),
        { params: queries }
      );
      if (response.status === 200 && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Get conversation failed.");
      }
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },
  messageMarkAsReadMessage: async (
    messageId: string,
    status: ENUM_MESSAGE_STATUS
  ) => {
    try {
      const response = await sharedApi.put<ConversationGetResponse>(
        API_ENDPOINTS.SHARED.MESSAGE_MARK_AS_READ(messageId),
        { status }
      );
      if (response.status === 200 && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Get conversation failed.");
      }
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },
};

export default chatService;
