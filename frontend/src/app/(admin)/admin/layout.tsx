// app/(admin)/layout.tsx
import type { Metadata } from "next";
import AdminHeader from "@/shared/components/Header/AdminHeader";
import { SidebarAdmin } from "@/components/Sidebar/Sidebar";

export const metadata: Metadata = {
  title: "Admin - Motorbike",
  description: "Admin Dashboard for Motorbike",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="antialiased">
      <div className="flex h-screen overflow-hidden">
        <div className="w-64 fixed h-full z-10 border-r bg-white">
          <SidebarAdmin />
        </div>

        <div className="flex-1 ml-[300px] flex flex-col overflow-auto">
          <AdminHeader />
          <main className="p-4 overflow-y-auto bg-[#FAFAFA] mt-[56px] h-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
