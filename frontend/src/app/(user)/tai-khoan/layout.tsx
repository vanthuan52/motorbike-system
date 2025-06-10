"use client";

import { useState } from "react";
import { FaBars } from "react-icons/fa";
import UserSidebar from "@/components/ui/User/UserSidebar";

export default function layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      <button
        className="fixed bottom-4 left-4 z-[101] bg-white border border-gray-200 rounded-full p-3 shadow-lg lg:hidden"
        onClick={() => setSidebarOpen(true)}
        aria-label="Mở menu"
      >
        <FaBars className="text-xl text-gray-700" />
      </button>

      <UserSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-white/30 backdrop-blur-sm transition-all"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-grow p-6 overflow-auto">{children}</main>
    </div>
  );
}
