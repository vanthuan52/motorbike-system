import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseApiState } from "@/types/redux-common.type";
import {
  Conversation,
  ConversationGetResponse,
  ListMessagesPayload,
  ListMessageResponse,
  MarkAsReadPayload,
  Message,
  ENUM_MESSAGE_STATUS,
  MessagePaginationQuery,
} from "../types";
import { ApiResponsePagination } from "@/types/api.type";
import { PAGINATION_QUERY_INITIAL_STATE } from "@/store/constant";
import { User } from "@/modules/user/types";
interface GetMessageSuccessPayload {
  list: Message[];
  pagination: ApiResponsePagination | undefined;
}
interface ChatState extends BaseApiState {
  conversations: Conversation[];
  selectedConversation: Conversation[] | null;
  messages: Message[];
  error: string | null;
  pagination: ApiResponsePagination | undefined;
}

const initialState: ChatState = {
  conversations: [],
  selectedConversation: null,
  messages: [],
  loadingList: false,
  loadingSingle: false,
  create: {
    loading: false,
    success: false,
  },
  update: {
    loading: false,
    success: false,
  },
  deletion: {
    loading: false,
    success: false,
  },
  partialUpdate: {
    loading: false,
    success: false,
  },
  error: null,
  pagination: PAGINATION_QUERY_INITIAL_STATE,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    createConversation(
      state,
      action: PayloadAction<{ senderId: User["_id"]; receiverId: User["_id"] }>
    ) {
      state.create.loading = true;
      state.create.success = false;
      state.error = null;
    },
    createConversationSuccess(state) {
      state.create.loading = false;
      state.create.success = true;
    },
    createConversationFailure(state, action: PayloadAction<string>) {
      state.create.loading = false;
      state.create.success = false;
      state.error = action.payload;
    },

    getConversation(state, action) {
      state.loadingSingle = true;
      state.error = null;
    },
    getConversationSuccess(state, action: PayloadAction<Conversation[]>) {
      state.loadingSingle = false;
      state.conversations = action.payload;
    },
    getConversationFailure(state, action: PayloadAction<string>) {
      state.loadingSingle = false;
      state.error = action.payload;
      state.conversations = [];
    },

    listMessageByConversation(
      state,
      action: PayloadAction<{
        conversationId: string;
        queries?: MessagePaginationQuery;
      }>
    ) {
      state.loadingList = true;
      state.error = null;
      state.pagination = undefined;
    },
    listMessageByConversationSuccess(
      state,
      action: PayloadAction<GetMessageSuccessPayload>
    ) {
      state.loadingList = false;
      state.messages = action.payload.list;
      state.pagination = action.payload.pagination;
    },
    listMessageByConversationFailure(state, action: PayloadAction<string>) {
      state.loadingList = false;
      state.error = action.payload;
      state.messages = [];
      state.pagination = undefined;
    },

    messageMarkAsReadMessage(
      state,
      action: PayloadAction<{
        messageId: Message["_id"];
        status: ENUM_MESSAGE_STATUS;
      }>
    ) {
      state.partialUpdate.loading = true;
      state.partialUpdate.success = false;
      state.error = null;
    },
    messageMarkAsReadMessageSuccess(
      state,
      action: PayloadAction<{
        messageId: Message["_id"];
        status: ENUM_MESSAGE_STATUS;
      }>
    ) {
      state.partialUpdate.loading = false;
      state.partialUpdate.success = true;
      state.error = null;
    },
    messageMarkAsReadMessageFailure(state, action: PayloadAction<string>) {
      state.partialUpdate.loading = false;
      state.partialUpdate.success = false;
      state.error = action.payload;
    },

    resetChatState(state) {
      state.conversations = [];
      state.selectedConversation = null;
      state.messages = [];
      state.loadingList = false;
      state.loadingSingle = false;
      state.create = { loading: false, success: false };
      state.partialUpdate = { loading: false, success: false };
      state.error = null;
    },
  },
});

export const chatActions = chatSlice.actions;
export default chatSlice.reducer;
