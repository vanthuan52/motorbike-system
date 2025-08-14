"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AnimatePresence } from "framer-motion";
import ChatButton from "./ChatButton";
import ChatPanel from "./ChatPanel";
import ChatBox from "./chatbox/ChatBox";
import { useChatWidget } from "./hooks/useChatWidget";
import { chatActions } from "@/features/chat/store/chat-slice";

export default function ChatWidget() {
  const dispatch = useDispatch();
  const {
    isOpen,
    selectedChat,
    selectedConversation,
    setSelectedChat,
    toggleChat,
    handleSelectChat,
    user,
    users,
    messages,
  } = useChatWidget();
  useEffect(() => {
    if (!isOpen) {
      dispatch(chatActions.resetChatState());
    }
  }, [isOpen, dispatch]);
  if (!selectedConversation) return null;

  return (
    <div className="fixed sm:bottom-4 sm:right-4 right-4 bottom-4 z-50">
      <AnimatePresence mode="wait">
        {isOpen ? (
          selectedChat ? (
            <ChatBox
              type={selectedChat}
              onBack={() => setSelectedChat(null)}
              onClose={toggleChat}
              userId={user?._id}
              conversationId={selectedConversation[0]?._id}
              users={users}
              messages={messages}
            />
          ) : (
            <ChatPanel onSelect={handleSelectChat} onClose={toggleChat} />
          )
        ) : (
          <ChatButton onClick={toggleChat} />
        )}
      </AnimatePresence>
    </div>
  );
}
