import React from "react";
import type { Metadata } from "next";
import TechnicianDashboardPage from "@/components/technician/Dashboard/Dashboard";

export const metadata: Metadata = {
  title: "Technician Dashboard | Motorbike",
  description: "Trang Dashboard cho kỹ thuật viên trong hệ thống Motorbike",
};

export default function Page() {
  return <TechnicianDashboardPage />;
}
