import { call, put, takeLatest } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { chatActions } from "./chat-slice";
import {
  Conversation,
  ConversationCreateResponse,
  ConversationGetResponse,
  ENUM_MESSAGE_STATUS,
  ListMessageResponse,
  Message,
  MessagePaginationQuery,
} from "../types";
import chatService from "../chat.service";
import { notificationActions } from "@/features/notification/store/notification-slice";
import { User } from "@/features/user/types";
import { ApiResponse } from "@/types/api.type";

function* handleCreateConversation(
  action: PayloadAction<{ senderId: User["_id"]; receiverId: User["_id"] }>
) {
  try {
    const response: ConversationCreateResponse = yield call(
      chatService.createConversation,
      action.payload.senderId,
      action.payload.receiverId
    );
    yield put(
      notificationActions.notify({
        type: "info",
        message: response.message,
      })
    );
    yield put(chatActions.createConversationSuccess());
  } catch (error: any) {
    yield put(chatActions.createConversationFailure(error.message));
  }
}

function* handleGetConversation() {
  try {
    const response: ConversationGetResponse = yield call(
      chatService.getConversation
    );
    yield put(chatActions.getConversationSuccess(response.data!));
  } catch (error: any) {
    yield put(chatActions.getConversationFailure(error.message));
  }
}

function* handleListMessageByConversation(
  action: PayloadAction<{
    conversationId: string;
    queries?: MessagePaginationQuery;
  }>
) {
  try {
    const messages: Message[] = yield call(
      chatService.listMessageByConversation,
      action.payload.conversationId,
      action.payload.queries
    );
    yield put(
      chatActions.listMessageByConversationSuccess({
        list: messages ?? [],
        pagination: undefined,
      })
    );
  } catch (error: any) {
    yield put(chatActions.listMessageByConversationFailure(error.message));
  }
}

function* handleMarkMessageAsRead(
  action: PayloadAction<{
    messageId: Message["_id"];
    status: ENUM_MESSAGE_STATUS;
  }>
) {
  try {
    const { messageId, status } = action.payload;
    const response: ApiResponse = yield call(
      chatService.messageMarkAsReadMessage,
      messageId,
      status
    );
    yield put(
      chatActions.messageMarkAsReadMessageSuccess({
        messageId: action.payload.messageId,
        status: action.payload.status,
      })
    );
  } catch (error: any) {
    yield put(chatActions.messageMarkAsReadMessageFailure(error.message));
  }
}

export function* chatSaga() {
  yield takeLatest(
    chatActions.createConversation.type,
    handleCreateConversation
  );
  yield takeLatest(chatActions.getConversation.type, handleGetConversation);
  yield takeLatest(
    chatActions.listMessageByConversation.type,
    handleListMessageByConversation
  );
  yield takeLatest(
    chatActions.messageMarkAsReadMessage.type,
    handleMarkMessageAsRead
  );
}
