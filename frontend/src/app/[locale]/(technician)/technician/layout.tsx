import type { Metadata } from "next";
import TechnicianHeader from "@/components/technician/Header/TechnicianHeader";
import { SidebarTechnician } from "@/components/technician/Sidebar/TechnicianSidebar";
import Breadcrumb from "@/components/breadcrum/Breadcrumb";

export const metadata: Metadata = {
  title: "Technician - Motorbike",
  description: "Technician Dashboard for Motorbike",
};

export default function TechnicianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="antialiased">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 fixed h-full z-10 border-r bg-white">
          <SidebarTechnician />
        </div>

        {/* Main content */}
        <div className="flex-1 ml-[256px] flex flex-col overflow-auto">
          <TechnicianHeader />
          <main className="p-4 overflow-y-auto bg-[#FAFAFA] mt-[56px] h-full">
            <Breadcrumb />
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
