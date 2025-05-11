import React from "react";
import { Metadata } from "next";
import Customers from "./components/Customers";

export const metadata: Metadata = {
  title: "Quản lý khách hàng | Motorbike",
  description: "Trang Quản lý khách hàng hệ thống Motorbike",
};

export default function page() {
  return <Customers />;
}
