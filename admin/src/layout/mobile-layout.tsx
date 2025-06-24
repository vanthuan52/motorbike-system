import { useState } from "react";
import { Outlet } from "react-router-dom";
import BottomNav from "@/components/mobile/bottom-nav";
import HeaderNav from "@/components/mobile/header-nav";
import MobileSidebar from "@/components/mobile/mobile-sidebar";
import Breadcrumb from "@/components/breadcrumb";

export default function MobileLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <HeaderNav
        onMenuClick={() => setSidebarOpen(true)}
        onNotificationClick={() => alert("Xem thông báo")}
      />
      <MobileSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="flex-1 overflow-y-auto py-5 pb-14 scrollbar-hidden">
        <div className="mt-8 space-y-4">
          {/* <Breadcrumb /> */}
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
