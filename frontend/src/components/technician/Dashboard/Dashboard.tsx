"use client";

import { Wrench, CalendarCheck, Clock } from "lucide-react";
import dynamic from "next/dynamic";
import StatCard from "@/components/technician/Dashboard/StatCard";
import TaskList from "@/components/technician/Dashboard/TaskList";

const DashboardChart = dynamic(
  () => import("@/components/technician/Dashboard/DashboardChart"),
  { ssr: false }
);

// Dữ liệu thống kê dành cho kỹ thuật viên
const stats = [
  {
    title: "Lịch hẹn hôm nay",
    value: "5 lịch hẹn",
    icon: <CalendarCheck size={30} />,
  },
  {
    title: "Đơn đang xử lý",
    value: "3 đơn",
    icon: <Wrench size={30} />,
  },
  {
    title: "Giờ làm việc hôm nay",
    value: "6 giờ",
    icon: <Clock size={30} />,
  },
];

export default function TechnicianDashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Trang tổng quan</h1>

      {/* Cards thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s, idx) => (
          <StatCard key={idx} title={s.title} value={s.value} icon={s.icon} />
        ))}
      </div>

      {/* Biểu đồ & danh sách nhiệm vụ */}
      <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 w-full">
        <div className="lg:col-span-5 flex flex-col gap-4">
          <DashboardChart />
        </div>
        <div className="lg:col-span-3 flex flex-col">
          <TaskList />
        </div>
      </div>
    </div>
  );
}
