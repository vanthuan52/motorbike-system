import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const statusData = [
  { name: "Đang chờ", value: 300 },
  { name: "Đang xử lý", value: 450 },
  { name: "Hoàn thành", value: 900 },
  { name: "Huỷ", value: 120 },
];

const COLORS = ["#FB7185", "#F97316", "#10B981", "#6B7280"];

export default function OrderStatusDonut() {
  const total = statusData.reduce((s, i) => s + i.value, 0);
  return (
    <div className="bg-white border border-[#E8E8E8] rounded-lg p-4 relative">
      <h3 className="font-semibold text-lg mb-3">Trạng thái đơn</h3>
      <div style={{ width: "100%", height: 325 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={statusData}
              dataKey="value"
              innerRadius={80}
              outerRadius={120}
              paddingAngle={2}
            >
              {statusData.map((entry, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center mt-2 absolute top-[35%] left-1/2 -translate-x-1/2">
        <div className="text-sm text-gray-500">Tổng đơn</div>
        <div className="text-xl font-bold">{total.toLocaleString()}</div>
      </div>

      <div className="mt-1 grid grid-cols-1 gap-2 text-sm">
        {statusData.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ background: COLORS[i] }}
            />
            <span>{s.name}</span>
            <span className="ml-auto text-gray-500">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
