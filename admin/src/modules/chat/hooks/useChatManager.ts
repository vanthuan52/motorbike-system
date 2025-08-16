import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState, useAppSelector } from "@/store";
import { chatActions } from "../store/chat-slice";
import { customerActions } from "@/modules/customer-management/store/customer-slice";
import { Conversation } from "../types";

interface props {
  conversationId: Conversation["_id"];
}
export function useChatManager({ conversationId }: props) {
  const dispatch = useDispatch();

  const {
    conversations,
    loadingList: loadingListConversations,
    messages,
    loadingListMessage: loadingListMessages,
  } = useSelector((state: RootState) => state.chat);

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
    if (conversationId) {
      dispatch(
        chatActions.listMessageByConversation({
          conversationId: conversationId,
          queries: { page: 1, perPage: 1000 },
        })
      );
    }
  }, [conversationId]);

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
    conversations,
    loadingListConversations,
    isAuthenticated,
    user,
    users,
    loadingListUsers,
    startNewConversation,
    messages,
    loadingListMessages,
  };
}
