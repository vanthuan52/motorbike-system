import React from "react";
import type { Metadata } from "next";
import DashboardPage from "./components/Dashboard";
export const metadata: Metadata = {
  title: "Dashboard | Motorbike",
  description: "Trang Dashboard hệ thống Motorbike",
};
export default function page() {
  return <DashboardPage />;
}
