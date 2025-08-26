import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ordersData = [
  { month: "Jan", loyal: 1200, newCus: 800 },
  { month: "Feb", loyal: 1800, newCus: 600 },
  { month: "Mar", loyal: 900, newCus: 1200 },
  { month: "Apr", loyal: 1400, newCus: 1000 },
  { month: "May", loyal: 1000, newCus: 1500 },
  { month: "Jun", loyal: 2000, newCus: 1100 },
  { month: "Jul", loyal: 1700, newCus: 1600 },
  { month: "Aug", loyal: 2200, newCus: 1300 },
  { month: "Sep", loyal: 1500, newCus: 1400 },
  { month: "Oct", loyal: 1900, newCus: 1800 },
  { month: "Nov", loyal: 2100, newCus: 1700 },
  { month: "Dec", loyal: 2400, newCus: 1900 },
];

export default function OrdersLineChart() {
  return (
    <div className="bg-white border border-[#E8E8E8] rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-lg">Số đơn</h3>
        <div className="text-sm text-gray-500">This Year</div>
      </div>
      <div style={{ width: "100%", height: 250 }}>
        <ResponsiveContainer>
          <LineChart data={ordersData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tickLine={false} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="loyal"
              stroke="#0ea5a4"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="newCus"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex  justify-center gap-4 mt-1 sm:mt-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#0ea5a4]" />
          Khách trung thành
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#f59e0b]" />
          Khách mới
        </div>
      </div>
    </div>
  );
}
