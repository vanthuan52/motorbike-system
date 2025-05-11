import React from "react";
import { Metadata } from "next";
import Employees from "./components/Employees";

export const metadata: Metadata = {
  title: "Quản lý nhân viên | Motorbike",
  description: "Trang Quản lý nhân viên hệ thống Motorbike",
};

export default function page() {
  return <Employees />;
}
