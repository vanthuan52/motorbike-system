import React from "react";
import AdminSidebar from "@/components/ui/Admin/admin-sidebar/admin-sidebar";
import AdminHeader from "@/components/ui/Admin/AdminHeader";
import MobileMenubar from "@/components/ui/Admin/mobile-menu-bar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <div className="w-full overflow-x-auto flex flex-col flex-1">
        <AdminHeader />
        <div className="overflow-hidden h-full sm:h-auto">
          {/* <div className="mt-2 md:mt-5 py-2 px-4 pb-14 overflow-hidden sm:overflow-auto"> */}
          {children}
        </div>
      </div>
      <MobileMenubar />
    </div>
  );
}
