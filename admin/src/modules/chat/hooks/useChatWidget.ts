import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { RootState, useAppSelector } from "@/store";
import { chatActions } from "../store/chat-slice";
import { customerActions } from "@/modules/customer-management/store/customer-slice";

export function useChatWidget() {
  const dispatch = useDispatch();
  const [selectedChat, setSelectedChat] = useState<"support" | "chat" | null>(
    null
  );

  const { conversations, messages } = useSelector(
    (state: RootState) => state.chat
  );

  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { users, loadingList: loadingListUsers } = useAppSelector(
    (state) => state.customer
  );

  const startNewConversation = (senderId: string) => {
    if (!isAuthenticated || !user) return;

    dispatch(
      chatActions.createConversation({
        senderId: user._id,
        receiverId: senderId,
      })
    );
  };

  useEffect(() => {
    if (
      !conversations ||
      (Array.isArray(conversations) && conversations.length === 0)
    ) {
      dispatch(chatActions.getConversation({}));
    }
  }, [conversations, messages]);

  useEffect(() => {
    if (
      conversations &&
      Array.isArray(conversations) &&
      conversations.length > 0
    ) {
      dispatch(
        chatActions.listMessageByConversation({
          conversationId: conversations[0]._id,
          queries: { page: 1, perPage: 1000 },
        })
      );
    }
  }, [conversations]);

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    if (users.length === 0) {
      dispatch(
        customerActions.getCustomers({
          page: 1,
          perPage: 1000,
        })
      );
    }
  }, [users, dispatch]);

  return {
    selectedChat,
    conversations,
    isAuthenticated,
    user,
    users,
    loadingListUsers,
    setSelectedChat,
    startNewConversation,
    messages,
  };
}
