"use client";

import { useState } from "react";

import { employeeData } from "@/data/EmployeeData";

import AccountsTabs from "./Accounts/AccountsTabs";
import NotificationsTabs from "./Notifications/NotificationsTabs";

function Settings() {
  const [activeTab, setActiveTab] = useState("accounts");
  const [avatar, setAvatar] = useState<string | null>(
    employeeData.photo || null
  );
  const [tabTransition, setTabTransition] = useState(false);

  const handleTabChange = (key: string) => {
    setTabTransition(true);
    setTimeout(() => {
      setActiveTab(key);
      setTabTransition(false);
    }, 200);
  };
  const tabs = {
    accounts: "Tài khoản",
    notifications: "Thông báo",
  };

  return (
    <div className="px-2 sm:px-4 py-6 sm:py-10 space-y-6 overflow-y-auto h-full">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Cài đặt</h1>
        <p className="text-gray-500">
          Quản lý cài đặt tài khoản và tùy chọn của bạn
        </p>
      </div>

      {/* Tabs */}
      <div className="w-full">
        <div className="flex gap-2">
          {Object.entries(tabs).map(([key, value]) => (
            <button
              key={key}
              onClick={() => handleTabChange(key)}
              className={`px-4 py-2 rounded-[30px] font-medium cursor-pointer ${
                activeTab === key
                  ? "bg-black text-white"
                  : "bg-gray-200 text-black hover:bg-gray-300"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
        <div
          className={`relative transition-all duration-300 ${
            tabTransition
              ? "opacity-0 translate-x-4 pointer-events-none"
              : "opacity-100 translate-x-0"
          }`}
        >
          {/* Tài khoản Tab */}
          {activeTab === "accounts" && (
            <AccountsTabs avatar={avatar} setAvatar={setAvatar} />
          )}
          {/* Thông báo Tab */}
          {activeTab === "notifications" && <NotificationsTabs />}
        </div>
      </div>
    </div>
  );
}

export default Settings;