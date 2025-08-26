import {
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

const paymentsData = [
  { name: "Tổng tiền", value: 70000, fill: "#064e3b" },
  { name: "Đã thanh toán", value: 40000, fill: "#4b7f6b" },
  { name: "Chưa thanh toán", value: 30000, fill: "#9ca3af" },
];

export default function PaymentsStatusChart() {
  return (
    <div className="bg-white border border-[#E8E8E8] rounded-lg p-4 flex flex-col justify-between">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-lg">Trạng thái thanh toán</h3>
        <div className="text-sm text-gray-500">Tuần này</div>
      </div>
      <div style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={paymentsData}
            margin={{ top: 30, right: 10, left: 10, bottom: 0 }}
            barCategoryGap="0"
          >
            <XAxis dataKey="name" tickLine={false} axisLine={false} hide />
            <Bar dataKey="value" radius={[10, 10, 0, 0]}>
              <LabelList
                dataKey="name"
                position="top"
                offset={-20}
                style={{ fill: "#000", fontWeight: 500, fontSize: 12 }}
              />
              <LabelList
                dataKey="value"
                position="top"
                formatter={(val: number) => `${val.toLocaleString("vi-VN")} ₫`}
                style={{ fill: "#000", fontWeight: 600 }}
              />
              {paymentsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
