import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 120000 },
  { month: "Feb", revenue: 300000 },
  { month: "Mar", revenue: 180000 },
  { month: "Apr", revenue: 260000 },
  { month: "May", revenue: 90000 },
  { month: "Jun", revenue: 320000 },
  { month: "Jul", revenue: 240000 },
  { month: "Aug", revenue: 450000 },
  { month: "Sep", revenue: 300000 },
  { month: "Oct", revenue: 200000 },
  { month: "Nov", revenue: 270000 },
  { month: "Dec", revenue: 350000 },
];

export default function RevenueBarChart() {
  return (
    <div className="bg-white border border-[#E8E8E8] rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-lg">Phân tích doanh thu</h3>
        <div className="text-sm text-gray-500">Tháng / Năm</div>
      </div>
      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tickLine={false} />
            <YAxis
              tickFormatter={(v) => new Intl.NumberFormat("vi-VN").format(v)}
            />
            <Tooltip
              formatter={(value: number) =>
                new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(value)
              }
            />
            <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
