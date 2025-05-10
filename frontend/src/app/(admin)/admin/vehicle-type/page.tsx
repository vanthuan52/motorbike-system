import React from "react";
import { Metadata } from "next";
import VehicleTypes from "./PartManagement/components/VehicleType";
export const metadata: Metadata = {
  title: "Quản lý loại xe | Motorbike",
  description: "Trang Quản lý loại xe hệ thống Motorbike",
};
export default function page() {
  return <VehicleTypes />;
}
