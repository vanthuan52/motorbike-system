// app/dashboard/page.tsx
"use client";

import RecentOrders from "./RecentOrders";
import StatCard from "./StatCard";
import TechnicianList from "./TechnicianList";
import { Banknote, Newspaper, Settings } from "lucide-react";

import DashboardChart from "./DashboardChart";

const stats = [
  {
    title: "Tổng doanh thu",
    value: "100.000.000 VND",
    icon: <Banknote size={30} />,
  },
  {
    title: "Tổng đơn sửa chữa",
    value: "100 đơn / tháng",
    icon: <Newspaper size={30} />,
  },
  {
    title: "Lịch hẹn mới",
    value: "10 lịch hẹn / ngày",
    icon: <Newspaper size={30} />,
  },
  {
    title: "Số lượng phụ tùng",
    value: "1.000.000 phụ tùng",
    icon: <Settings size={30} />,
  },
];

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6 h-full overflow-y-scroll">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <StatCard key={idx} title={s.title} value={s.value} icon={s.icon} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 w-full">
        <div className="lg:col-span-6 flex flex-col gap-4">
          <DashboardChart />
          <RecentOrders />
        </div>

        <div className="lg:col-span-2 flex flex-col">
          <TechnicianList />
        </div>
      </div>
    </div>
  );
}
