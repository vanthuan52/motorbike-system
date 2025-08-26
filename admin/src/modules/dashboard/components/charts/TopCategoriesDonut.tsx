import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const categories = [
  { name: "Lốp xe", value: 1350765 },
  { name: "Phụ tùng", value: 165765 },
  { name: "Dầu nhớt", value: 150765 },
];

const COLORS = ["#0f766e", "#f97316", "#ef4444", "#f472b6"];

export default function TopCategoriesDonut() {
  const total = categories.reduce((s, i) => s + i.value, 0);
  return (
    <div className="bg-white border border-[#E8E8E8] rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-lg">Top danh mục</h3>
        <div className="text-sm text-gray-500">
          Tổng:{" "}
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(total)}
        </div>
      </div>

      <div style={{ width: "100%", height: 200 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={categories}
              dataKey="value"
              innerRadius={48}
              outerRadius={80}
              paddingAngle={2}
            >
              {categories.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 sm:mt-6 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
        {categories.map((c, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ background: COLORS[i] }}
            />
            <div className="flex-1">
              <div className="font-medium">{c.name}</div>
              <div className="text-gray-500 text-xs">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(c.value)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
