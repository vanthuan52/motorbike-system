import React from "react";
import type { Metadata } from "next";
import Maintenance from "./components/Maintenance";
export const metadata: Metadata = {
  title: "Quản lý bảo dưỡng | Motorbike",
  description: "Trang Quản lý bảo dưỡng hệ thống Motorbike",
};
export default function page() {
  return <Maintenance />;
}
