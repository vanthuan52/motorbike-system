"use client";
import React, { useState, useRef, useEffect } from "react";
import { User, Bell } from "lucide-react";

const TechnicianHeader: React.FC = () => {
  const [userOpen, setUserOpen] = useState(false);
  const [notiOpen, setNotiOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);
  const notiRef = useRef<HTMLDivElement>(null);
  const notificationCount = 3;

  const notifications = [
    { id: 1, message: "Bạn có công việc mới", time: "5 phút trước" },
    { id: 2, message: "Lịch làm việc đã được cập nhật", time: "1 giờ trước" },
    { id: 3, message: "Thông báo hệ thống bảo trì", time: "Hôm qua" },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserOpen(false);
      }
      if (notiRef.current && !notiRef.current.contains(e.target as Node)) {
        setNotiOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 z-50 w-[calc(100%-256px)] bg-white border-b border-[#E8E8E8] px-4 py-3 flex justify-end">
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative" ref={notiRef}>
          <button
            onClick={() => setNotiOpen(!notiOpen)}
            className="rounded-full p-1 border border-[#E8E8E8] hover:bg-gray-100 transition relative"
            aria-label="Thông báo"
          >
            <Bell size={20} />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                {notificationCount}
              </span>
            )}
          </button>
          {notiOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-200 z-50">
              <div className="px-4 py-2 border-b font-semibold text-sm">
                Thông báo mới
              </div>
              <ul className="max-h-60 overflow-auto">
                {notifications.map((noti) => (
                  <li key={noti.id} className="px-4 py-2 hover:bg-gray-50">
                    <p className="text-sm">{noti.message}</p>
                    <p className="text-xs text-gray-500">{noti.time}</p>
                  </li>
                ))}
              </ul>
              <div className="border-t">
                <button className="w-full text-center text-sm py-2 text-blue-600 hover:bg-gray-50">
                  Xem tất cả thông báo
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Dropdown */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setUserOpen(!userOpen)}
            className="rounded-full p-1 border border-[#E8E8E8] hover:bg-gray-100 transition"
          >
            <User size={20} />
          </button>
          {userOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50">
              <div className="px-4 py-3">
                <p className="text-sm font-medium">Nguyễn Văn A</p>
                <p className="text-sm text-gray-500 truncate">
                  nguyenvana@gmail.com
                </p>
              </div>
              <div className="border-t border-gray-100" />
              <ul className="py-1 text-sm text-gray-700">
                <li>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                    Công việc hôm nay
                  </button>
                </li>
                <li>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                    Lịch làm việc
                  </button>
                </li>
                <li>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                    Hồ sơ cá nhân
                  </button>
                </li>
              </ul>
              <div className="border-t border-gray-100" />
              <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TechnicianHeader;
