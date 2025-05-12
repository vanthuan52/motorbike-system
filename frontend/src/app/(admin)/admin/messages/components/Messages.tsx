"use client";
import { useEffect, useState } from "react";
import { Skeleton } from "antd";
import ChatSidebar from "./ChatSidebar";
import ChatMain from "./ChatMain";
import { Conversation } from "@/types/Messages";
import { mockConversations } from "@/data/MessagesData";

export default function Messages() {
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [search, setSearch] = useState("");
  const [containerHeight, setContainerHeight] = useState("calc(100dvh - 64px)");
  const [loadingSidebar, setLoadingSidebar] = useState(true);
  const [conversations, setConversations] =
    useState<Conversation[]>(mockConversations);

  useEffect(() => {
    const updateHeight = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setContainerHeight("calc(100dvh - 119px)");
      } else {
        setContainerHeight("calc(100dvh - 64px)");
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, []);
  useEffect(() => {
    const t = setTimeout(() => setLoadingSidebar(false), 1200);
    return () => clearTimeout(t);
  }, []);
  const startNewConversation = (userId: string) => {
    const existingConversation = conversations.find(
      (conv) => conv.user.id === userId
    );

    if (existingConversation) {
      setSelectedConversation(existingConversation);
      return;
    }
    const user = mockConversations.find(
      (conv) => conv.user.id === userId
    )?.user;
    if (!user) {
      console.error("User not found for ID:", userId);
      return;
    }

    const newConversation: Conversation = {
      id: `conv_${Date.now()}`,
      user: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        lastSeen: user.lastSeen,
        role: user.role,
        location: user.location,
        timezone: user.timezone,
      },
      lastMessage: "",
      lastMessageTime: new Date().toLocaleTimeString(),
      messages: [],
      photos: [],
      files: [],
    };

    setConversations((prev) => [newConversation, ...prev]);

    setSelectedConversation(newConversation);
  };

  return (
    <div
      className="flex w-full bg-gray-100 h-full overflow-hidden pb-0 sm:pb-0 min-h-screen"
      style={{ height: containerHeight, minHeight: containerHeight }}
    >
      <div
        className={`
    fixed inset-y-0 left-0 z-50 w-full bg-white shadow-md 
    transform transition-transform duration-300
    lg:static lg:transform-none lg:w-64 h-full 
    ${
      selectedConversation
        ? "-translate-x-full lg:translate-x-0"
        : "translate-x-0"
    }
  `}
      >
        <div className="h-full overflow-y-auto scrollbar-thin">
          <style jsx>{`
            .scrollbar-thin::-webkit-scrollbar {
              width: 0 !important;
              background: transparent;
            }
          `}</style>

          {loadingSidebar ? (
            <div className="p-4">
              {[...Array(conversations.length)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 mb-4">
                  <Skeleton.Avatar active size={40} shape="circle" />
                  <div className="flex-1">
                    <Skeleton.Input
                      active
                      size="small"
                      style={{ width: 120, marginBottom: 4 }}
                    />
                    <Skeleton.Input active size="small" style={{ width: 80 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ChatSidebar
              conversations={conversations}
              onSelectConversation={setSelectedConversation}
              search={search}
              onSearch={setSearch}
              selectedConversation={selectedConversation}
              onStartNewConversation={startNewConversation}
            />
          )}
        </div>
      </div>

      <div
        className={`flex-1 h-full ${
          selectedConversation ? "block" : "hidden lg:block"
        }`}
      >
        {selectedConversation ? (
          <div className="h-full overflow-y-auto">
            <ChatMain
              conversation={selectedConversation}
              onBack={() => setSelectedConversation(null)}
            />
          </div>
        ) : (
          <div className="hidden lg:flex flex-1 items-center justify-center text-gray-500">
            Chọn một cuộc trò chuyện để bắt đầu trò chuyện
          </div>
        )}
      </div>
    </div>
  );
}
