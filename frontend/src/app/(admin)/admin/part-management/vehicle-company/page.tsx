import React from "react";
import { Metadata } from "next";
import VehicleCompany from "./components/VehicleCompany";
export const metadata: Metadata = {
  title: "Quản lý hãng xe | Motorbike",
  description: "Trang Quản lý hãng xe hệ thống Motorbike",
};
export default function page() {
  return <VehicleCompany />;
}
