import { Metadata } from "next";
import MaintenanceHistory from "./MaintenanceHistory";

export const metadata: Metadata = {
  title: "Lịch sử bảo dưỡng",
  description: "Xem lại các lần bảo dưỡng xe máy của bạn",
};

export default function page() {
  return (
    <div className="w-full">
      <MaintenanceHistory />
    </div>
  );
}
