import React from "react";
import type { Metadata } from "next";
import TechnicianDashboardPage from "@/app/(technician)/technician/dashboard/_components/Dashboard";

export const metadata: Metadata = {
  title: "Technician Dashboard | Motorbike",
  description: "Trang Dashboard cho kỹ thuật viên trong hệ thống Motorbike",
};

export default function Page() {
  return <TechnicianDashboardPage />;
}
