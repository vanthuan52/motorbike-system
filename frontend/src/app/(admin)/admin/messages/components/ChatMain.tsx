"use client";
import { useEffect, useState } from "react";
import { Skeleton } from "antd";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import ChatMediaSidebar from "./ChatMediaSidebar";
import { Conversation, Message, UserMessage } from "@/types/Messages";

interface ChatMainProps {
  conversation: Conversation;
  onBack: () => void;
  availableUsers?: UserMessage[];
}

export default function ChatMain({ conversation, onBack }: ChatMainProps) {
  const [isMediaSidebarOpen, setIsMediaSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>(conversation.messages);
  const [clearInput, setClearInput] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  useEffect(() => {
    setLoadingMessages(true);
    const t = setTimeout(() => {
      setMessages(conversation.messages);
      setClearInput(true);
      setLoadingMessages(false);
      setTimeout(() => setClearInput(false), 0);
    }, 800);
    return () => clearTimeout(t);
  }, [conversation.id, conversation.messages]);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Math.random().toString(36).substring(2, 9),
      senderId: "2",
      content,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    setMessages((prev) => [...prev, newMessage]);
    setClearInput(true);
    setTimeout(() => setClearInput(false), 0);
  };

  return (
    <div className="flex-1 flex h-full">
      <div
        className={`flex-1 flex flex-col h-full transition-all duration-300 ${
          isMediaSidebarOpen ? "lg:mr-[320px]" : "lg:mr-0"
        }`}
      >
        <ChatHeader
          user={conversation.user}
          onToggleMediaSidebar={() =>
            setIsMediaSidebarOpen(!isMediaSidebarOpen)
          }
          onBack={onBack}
        />
        {loadingMessages ? (
          <div className="flex-1 p-4 space-y-4">
            {[...Array(messages.length)].map((_, i) => {
              const isSender = i % 2 === 0;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-2 ${
                    isSender ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isSender && (
                    <Skeleton.Avatar active size={32} shape="circle" />
                  )}
                  <Skeleton.Input
                    active
                    size="small"
                    style={{ width: 180, borderRadius: 8 }}
                  />
                  {isSender && (
                    <Skeleton.Avatar active size={32} shape="circle" />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <ChatMessages messages={messages} conversation={conversation} />
        )}

        <ChatInput onSendMessage={handleSendMessage} clearInput={clearInput} />
      </div>

      <div
        className={`fixed inset-y-0 right-0 z-50 w-full bg-white shadow-md transform transition-transform duration-300 top-16
          lg:w-80 lg:top-16 lg:${
            isMediaSidebarOpen ? "translate-x-0" : "translate-x-full"
          }
          ${isMediaSidebarOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <ChatMediaSidebar
          photos={conversation.photos || []}
          files={conversation.files || []}
          onToggleMediaSidebar={() =>
            setIsMediaSidebarOpen(!isMediaSidebarOpen)
          }
          conversation={conversation}
          loadingMessages={loadingMessages}
        />
      </div>
    </div>
  );
}
