import { Metadata } from "next";
import VehicleManagement from "./VehicleManagement";

export const metadata: Metadata = {
  title: "Quản lý phương tiện",
  description: "Quản lý phương tiện của bạn",
};

export default function page() {
  return (
    <div className="w-full">
      <VehicleManagement />
    </div>
  );
}
