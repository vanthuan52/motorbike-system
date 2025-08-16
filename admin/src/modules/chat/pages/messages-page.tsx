import { useEffect, useState } from "react";
import { Skeleton } from "antd";
import { Conversation } from "../types";
import ChatSidebar from "../components/ChatSidebar";
import ChatMain from "../components/ChatMain";
import "./messages-page-module.scss";
import { useChatManager } from "../hooks/useChatManager";
export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState<
    Conversation["_id"] | null
  >(null);
  const [search, setSearch] = useState("");
  const [containerHeight, setContainerHeight] = useState("calc(100dvh - 65px)");
  const [containerChatMainHeight, setContainerChatMainHeight] = useState(
    "calc(100dvh - 64px)"
  );

  useEffect(() => {
    const updateHeight = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setContainerHeight("calc(100dvh - 95px)");
        setContainerChatMainHeight("calc(100dvh - 95px)");
      } else {
        setContainerHeight("calc(100dvh - 65px)");
        setContainerChatMainHeight("calc(100dvh - 65px)");
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const {
    conversations,
    loadingListConversations,
    user,
    users,
    messages,
    loadingListMessages,
    startNewConversation,
  } = useChatManager({ conversationId: selectedConversation || "" });

  if (!user || !users) {
    return null;
  }
  const renderSidebar = () => (
    <div className="h-full overflow-y-auto scrollbar-thin">
      {loadingListConversations ? (
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
          currentUserId={user._id}
          users={users}
        />
      )}
    </div>
  );
  const selectedConversationObj = conversations.find(
    (c) => c._id === selectedConversation
  );
  // Render main chat area
  const renderChatMain = () =>
    selectedConversation && selectedConversationObj ? (
      <div className="h-full overflow-y-auto">
        <ChatMain
          conversation={selectedConversationObj}
          selectedConversation={selectedConversation}
          messages={messages}
          loadingListMessages={loadingListMessages}
          user={user}
          users={users}
          onBack={() => setSelectedConversation(null)}
        />
      </div>
    ) : (
      <div className="hidden lg:flex flex-1 items-center justify-center text-gray-500">
        Chọn một cuộc trò chuyện để bắt đầu trò chuyện
      </div>
    );

  return (
    <div
      className="flex w-full bg-gray-100 h-full overflow-hidden sm:pb-0 min-h-screen"
      style={{ height: containerHeight, minHeight: containerHeight }}
    >
      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 top-10 z-50 w-full bg-white shadow-md 
          transform transition-transform duration-300
          lg:static lg:transform-none lg:w-64 h-full 
          ${selectedConversation ? "-translate-x-full lg:translate-x-0" : "translate-x-0"}
        `}
        style={{ height: "calc(100dvh - 105px)", minHeight: containerHeight }}
      >
        {renderSidebar()}
      </div>

      {/* Main chat area */}
      <div
        className={`flex-1 h-full ${
          selectedConversation
            ? "fixed sm:static inset-y-0 left-0 top-10 z-50 w-full"
            : "hidden lg:block"
        }`}
        style={{
          height: containerChatMainHeight,
          minHeight: containerChatMainHeight,
        }}
      >
        {renderChatMain()}
      </div>
    </div>
  );
}
