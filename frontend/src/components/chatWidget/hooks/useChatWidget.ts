import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { chatActions } from "@/features/chat/store/chat-slice";
import { RootState, useAppSelector } from "@/store";
import { userActions } from "@/features/user/store/user-slice";

export function useChatWidget() {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<"support" | "chat" | null>(
    null
  );
  const conversationFetched = useRef(false);
  const {
    createdConversationId,
    selectedConversation,
    messages,
    loadingList: loadingListMessages,
  } = useSelector((state: RootState) => state.chat);

  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { users } = useAppSelector((state) => state.users);

  const toggleChat = () => setIsOpen((prev) => !prev);

  const handleSelectChat = (target: "support" | "chat") => {
    if (!isAuthenticated || !user || !users) return;
    setSelectedChat(target);

    if (target === "chat") {
      dispatch(
        chatActions.createConversation({
          senderId: user._id,
          receiverId: users[0]._id,
        })
      );
    }
  };

  useEffect(() => {
    if (!isOpen || !isAuthenticated || !user) return;
    if (
      (!selectedConversation ||
        (Array.isArray(selectedConversation) &&
          selectedConversation.length === 0)) &&
      !conversationFetched.current
    ) {
      dispatch(chatActions.getConversation({}));
      conversationFetched.current = true;
    }
    if (!isOpen) {
      conversationFetched.current = false;
    }
  }, [isOpen, selectedConversation, messages, isAuthenticated, user, dispatch]);

  useEffect(() => {
    if (createdConversationId && selectedChat) {
      dispatch(
        chatActions.listMessageByConversation({
          conversationId: createdConversationId,
          queries: { page: 1, perPage: 1000 },
        })
      );
    }
  }, [createdConversationId, selectedChat, dispatch]);

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    if (users.length === 0) {
      dispatch(
        userActions.getAdminTechnicians({
          page: 1,
          perPage: 1,
        })
      );
    }
  }, [users, dispatch]);

  return {
    isOpen,
    selectedChat,
    selectedConversation,
    isAuthenticated,
    user,
    users,
    setSelectedChat,
    toggleChat,
    handleSelectChat,
    messages,
    loadingListMessages,
  };
}
