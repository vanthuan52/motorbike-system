import React from "react";
import { Metadata } from "next";
import VehicleParts from "./components/VehiclePart";
export const metadata: Metadata = {
  title: "Quản lý phụ tùng | Motorbike",
  description: "Trang Quản lý phụ tùng hệ thống Motorbike",
};
export default function page() {
  return <VehicleParts />;
}
