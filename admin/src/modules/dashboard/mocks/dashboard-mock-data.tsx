import { Banknote, Newspaper, Settings } from "lucide-react";

const stats = [
  {
    title: "Tổng doanh thu",
    value: "₫100.000.000",
    icon: <Banknote size={22} />,
  },
  {
    title: "Tổng đơn sửa",
    value: "120 đơn / tháng",
    icon: <Newspaper size={22} />,
  },
  { title: "Lịch hẹn mới", value: "10 / ngày", icon: <Newspaper size={22} /> },
  { title: "Số phụ tùng", value: "1.200", icon: <Settings size={22} /> },
];

const areaData = [
  { name: "Tháng 1", value: 300 },
  { name: "Tháng 2", value: 500 },
  { name: "Tháng 3", value: 400 },
  { name: "Tháng 4", value: 650 },
  { name: "Tháng 5", value: 550 },
  { name: "Tháng 6", value: 700 },
  { name: "Tháng 7", value: 600 },
  { name: "Tháng 8", value: 750 },
  { name: "Tháng 9", value: 680 },
  { name: "Tháng 10", value: 820 },
  { name: "Tháng 11", value: 900 },
  { name: "Tháng 12", value: 1000 },
];

const ordersLineData = [
  { name: "Jan", loyal: 1200, new: 800 },
  { name: "Feb", loyal: 2000, new: 1300 },
  { name: "Mar", loyal: 900, new: 600 },
  { name: "Apr", loyal: 2400, new: 1600 },
  { name: "May", loyal: 1700, new: 2100 },
  { name: "Jun", loyal: 2100, new: 1200 },
  { name: "Jul", loyal: 2600, new: 1400 },
  { name: "Aug", loyal: 2300, new: 1900 },
  { name: "Sep", loyal: 1800, new: 1700 },
  { name: "Oct", loyal: 2200, new: 2000 },
  { name: "Nov", loyal: 3000, new: 2400 },
  { name: "Dec", loyal: 3200, new: 2600 },
];

const donutData = [
  { name: "Chờ xử lý", value: 400 },
  { name: "Đang sửa", value: 900 },
  { name: "Hoàn thành", value: 1100 },
  { name: "Hủy", value: 200 },
];

const topCategories = [
  { name: "Phụ tùng", value: 1350765 },
  { name: "Dầu nhớt", value: 165765 },
  { name: "Phụ kiện", value: 150765 },
  { name: "Dịch vụ", value: 100765 },
];

const recentOrders = Array.from({ length: 6 }).map((_, i) => ({
  id: 2300 + i,
  product: "Dịch vụ bảo dưỡng toàn bộ",
  price: "₫541.000",
  buyer: "Nguyễn Văn A",
  phone: "090-xxx-xxxx",
  status: i % 3 === 0 ? "Đã thanh toán" : i % 3 === 1 ? "Chờ" : "Đang xử lý",
  orderStatus: i % 2 === 0 ? "Hoàn thành" : "Đang sửa",
  date: "09-10-2024",
}));

const COLORS = ["#f97316", "#ef4444", "#10b981", "#94a3b8"];

export {
  stats,
  areaData,
  ordersLineData,
  donutData,
  topCategories,
  recentOrders,
  COLORS,
};
