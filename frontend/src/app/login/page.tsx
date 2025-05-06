import React from "react";
import type { Metadata } from "next";
import LoginPage from "@/components/Login/Login";
export const metadata: Metadata = {
  title: "Đăng nhập | Motorbike",
  description: "Trang đăng nhập người dùng hệ thống Motorbike",
};
export default function page() {
  return <LoginPage />;
}
