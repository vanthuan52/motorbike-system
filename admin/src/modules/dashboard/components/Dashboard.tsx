// DashboardPage.tsx
import RecentOrders from "./RecentOrders";
import StatCard from "./StatCard";
import TechnicianList from "./TechnicianList";
import RevenueBarChart from "./charts/RevenueBarChart";
import OrdersLineChart from "./charts/OrdersLineChart";
import OrderStatusDonut from "./charts/OrderStatusDonut";
import TopCategoriesDonut from "./charts/TopCategoriesDonut";
import PaymentsStatusChart from "./charts/PaymentsStatusChart";
import { Banknote, Newspaper, Settings } from "lucide-react";

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
    <div className="p-6 space-y-6 h-full overflow-y-auto bg-gray-50">
      <h1 className="text-2xl font-semibold !mb-4">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-9 space-y-4">
          <div className="flex sm:flex-row flex-col gap-4">
            {stats.map((s, idx) => (
              <StatCard
                key={idx}
                title={s.title}
                value={s.value}
                icon={s.icon}
              />
            ))}
          </div>

          {/* Revenue + Top Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8">
              <RevenueBarChart />
            </div>
            <div className="lg:col-span-4">
              <TopCategoriesDonut />
            </div>
          </div>
        </div>

        {/* Order Status */}
        <div className="lg:col-span-3">
          <OrderStatusDonut />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-3">
          <TechnicianList />
        </div>
        <div className="lg:col-span-6">
          <OrdersLineChart />
        </div>
        <div className="lg:col-span-3">
          <PaymentsStatusChart />
        </div>
      </div>

      <div>
        <RecentOrders />
      </div>
    </div>
  );
}
