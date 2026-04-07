"use client";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AnimatePresence } from "framer-motion";
import { Spin } from "antd";
import ChatButton from "./ChatButton";
import ChatPanel from "./ChatPanel";
import ChatBox from "./chatbox/ChatBox";
import { useChatWidget } from "./hooks/useChatWidget";
import { chatActions } from "@/features/chat/store/chat-slice";
import AuthModal from "../authModal";

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
    isAuthenticated,
    loadingListMessages,
  } = useChatWidget();

  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      dispatch(chatActions.resetChatState());
    }
  }, [isOpen, dispatch]);

  const handleChatButtonClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      toggleChat();
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    toggleChat();
  };
  return (
    <div className="relative z-50 flex justify-end">
      <AnimatePresence mode="wait">
        {showAuthModal ? (
          <AuthModal
            open={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            onSuccess={handleAuthSuccess}
          />
        ) : isOpen ? (
          selectedChat ? (
            selectedConversation &&
            Array.isArray(selectedConversation) &&
            selectedConversation.length > 0 ? (
              loadingListMessages ? (
                <div className="w-80 bg-white rounded-xl shadow-xl p-6 flex items-center justify-center">
                  <Spin tip="Đang tải tin nhắn..." />
                </div>
              ) : (
                <ChatBox
                  type={selectedChat}
                  onBack={() => setSelectedChat(null)}
                  onClose={toggleChat}
                  userId={user?._id}
                  conversationId={selectedConversation[0]?._id}
                  users={users}
                  messages={messages}
                />
              )
            ) : (
              <button
                onClick={() => handleSelectChat("chat")}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-300 cursor-pointer"
              >
                👤 Chat with us
              </button>
            )
          ) : (
            <ChatPanel onSelect={handleSelectChat} onClose={toggleChat} />
          )
        ) : (
          <ChatButton onClick={handleChatButtonClick} />
        )}
      </AnimatePresence>
    </div>
  );
}
