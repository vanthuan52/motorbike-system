// notification-sidebar.tsx
"use client";
import React, { useState } from "react";
import { X, MessageSquare, Bell } from "lucide-react";

interface NotificationSidebarProps {
  onClose: () => void;
}

const mockNotifications = [
  {
    id: 1,
    title: "Bảo dưỡng định kỳ",
    message: "Xe của anh/chị đã đến hạn bảo dưỡng sau 1000km.",
    time: "5 phút trước",
  },
  {
    id: 2,
    title: "Nhắc nạp dầu phanh",
    message: "Bạn cần kiểm tra và nạp dầu phanh trong tuần này.",
    time: "1 giờ trước",
  },
];

const mockChats = [
  {
    id: 1,
    user: "Nguyễn Văn A",
    avatar: "https://i.pravatar.cc/150?img=3",
    lastMessage: "Anh/chị có thể gửi báo giá chi tiết không?",
    time: "10 phút trước",
  },
  {
    id: 2,
    user: "Trần Thị B",
    avatar: "https://i.pravatar.cc/150?img=5",
    lastMessage: "Khi nào em đã xong bảo dưỡng thì báo nhé.",
    time: "30 phút trước",
  },
];

const NotificationSidebar: React.FC<NotificationSidebarProps> = ({
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"chat" | "noti">("noti");

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">
          {activeTab === "noti" ? "Thông báo" : "Chat"}
        </h2>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-gray-100 transition"
        >
          <X size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab("noti")}
          className={`flex-1 py-2 flex items-center justify-center gap-2 ${
            activeTab === "noti"
              ? "border-b-2 border-blue-500 font-medium"
              : "text-gray-500 hover:bg-gray-100"
          } transition`}
        >
          <Bell size={16} />
          Thông báo
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex-1 py-2 flex items-center justify-center gap-2 ${
            activeTab === "chat"
              ? "border-b-2 border-blue-500 font-medium"
              : "text-gray-500 hover:bg-gray-100"
          } transition`}
        >
          <MessageSquare size={16} />
          Chat
        </button>
      </div>

      {/* Nội dung */}
      <div className="p-4 overflow-y-auto flex-1 space-y-4">
        {activeTab === "noti" &&
          (mockNotifications.length > 0 ? (
            mockNotifications.map((noti) => (
              <div
                key={noti.id}
                className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <h3 className="font-medium">{noti.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{noti.message}</p>
                <span className="text-xs text-gray-400">{noti.time}</span>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">Không có thông báo nào</p>
          ))}

        {activeTab === "chat" &&
          (mockChats.length > 0 ? (
            mockChats.map((chat) => (
              <div
                key={chat.id}
                className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <img
                  src={chat.avatar}
                  alt={chat.user}
                  className="w-8 h-8 rounded-full mr-3"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{chat.user}</h3>
                  <p className="text-sm text-gray-600 mt-1">{chat.lastMessage}</p>
                </div>
                <span className="text-xs text-gray-400 ml-2">{chat.time}</span>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">Không có cuộc trò chuyện nào</p>
          ))}
      </div>
    </div>
  );
};

export default NotificationSidebar;
