import { Skeleton } from "antd";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import { Conversation, Message } from "../types";
import { User } from "@/modules/user/types";
import { useChatSocket } from "../hooks/useChatSocket";
import ChatMediaSidebar from "./ChatMediaSidebar";
import { useEffect, useState } from "react";

interface ChatMainProps {
  conversation: Conversation;
  selectedConversation: Conversation["_id"];
  messages: Message[];
  onBack: () => void;
  user: User;
  users?: User[];
  loadingListMessages?: boolean;
}

export default function ChatMain({
  conversation,
  messages,
  selectedConversation,
  onBack,
  user,
  users,
  loadingListMessages,
}: ChatMainProps) {
  const [isMediaSidebarOpen, setIsMediaSidebarOpen] = useState(false);
  useEffect(() => {
    const updateHeight = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setIsMediaSidebarOpen(false);
      } else {
        setIsMediaSidebarOpen(true);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, []);
  const {
    input,
    isTyping,
    typingUserId,
    endRef,
    currentTime,
    handleSendMessage,
    onInputChange,
  } = useChatSocket({
    conversationId: selectedConversation,
    userId: user._id,
    users,
  });
  return (
    <div className="flex-1 flex h-full">
      <div
        className={`flex-1 flex flex-col h-full transition-all duration-300 ${
          isMediaSidebarOpen ? "lg:mr-[320px]" : "lg:mr-0"
        }`}
      >
        <ChatHeader
          user={
            conversation.participants.filter((u) => u._id !== user._id)[0] ||
            user
          }
          onBack={onBack}
          onToggleMediaSidebar={() =>
            setIsMediaSidebarOpen(!isMediaSidebarOpen)
          }
        />
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {loadingListMessages ? (
            <Skeleton active paragraph={{ rows: messages.length }} />
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender._id === user._id;
              return (
                <div
                  key={msg._id}
                  className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}
                >
                  {!isMe && (
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(msg.sender.name)}`}
                      alt={msg.sender.name}
                      className="w-8 h-8 rounded-full"
                    />
                  )}

                  <div className="flex flex-col max-w-[70%]">
                    <div
                      className={`px-3 py-2 rounded-lg break-words ${
                        isMe
                          ? "bg-blue-600 text-white rounded-br-none self-end"
                          : "bg-gray-200 text-black rounded-bl-none self-start"
                      }`}
                    >
                      {msg.content}
                    </div>
                    <div
                      className={`mt-1 text-xs text-gray-400 flex items-center gap-1 ${
                        isMe ? "justify-end" : "justify-start"
                      }`}
                    >
                      <span>
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {isMe &&
                        Array.isArray(msg.readBy) &&
                        msg.readBy.some((u) => u !== msg.sender._id) && (
                          <span title="Đã đọc">✔✔</span>
                        )}
                    </div>
                  </div>

                  {isMe && (
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(msg.sender.name)}`}
                      alt={msg.sender.name}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                </div>
              );
            })
          )}
          <div ref={endRef} />
          {isTyping && typingUserId && (
            <div className="flex items-start gap-2">
              <img
                src={(() => {
                  const userObj = users?.find((u) => u._id === typingUserId);
                  return `https://ui-avatars.com/api/?name=${userObj?.name}`;
                })()}
                alt="Typing User"
                width={32}
                height={32}
                className="rounded-full"
              />
              <div className="bg-gray-100 text-black px-3 py-2 rounded-tr-lg rounded-br-lg rounded-bl-lg max-w-[90%]">
                <div className="loader"></div>
              </div>
            </div>
          )}
        </div>
        <ChatInput
          input={input}
          setInput={(v: string) => onInputChange(v)}
          handleSendMessage={handleSendMessage}
        />
        <div
          className={`fixed inset-y-0 right-0 z-50 w-full bg-white shadow-md transform transition-transform duration-300 top-10
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
            loadingMessages={loadingListMessages}
            user={user}
          />
        </div>
      </div>
    </div>
  );
}
