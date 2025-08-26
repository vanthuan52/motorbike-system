import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const chartData = [
  { name: 1, value: 60 },
  { name: 2, value: 160 },
  { name: 3, value: 70 },
  { name: 4, value: 40 },
  { name: 5, value: 50 },
  { name: 6, value: 60 },
  { name: 7, value: 130 },
  { name: 8, value: 150 },
  { name: 9, value: 60 },
  { name: 10, value: 90 },
  { name: 11, value: 180 },
  { name: 12, value: 60 },
];

export default function DashboardChart() {
  const monthNames = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("Tháng");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="col-span-2 bg-white">
      <div className="h-full border border-[#E8E8E8] rounded-lg flex flex-col">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold mb-6 text-lg !p-0 !m-0">
              Số đơn bảo dưỡng
            </span>

            {/* Dropdown menu */}
            <div className="relative text-sm text-gray-600" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-100"
              >
                <span>{selectedMonth}</span>
                <ChevronDown size={16} />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-50">
                  {monthNames.map((month, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedMonth(month);
                        setDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {month}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chart */}
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="10%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="0" vertical={false} />
              <XAxis dataKey="name" tickLine={false} />
              <YAxis tickLine={false} ticks={[0, 50, 100, 150, 200]} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                fill="url(#colorValue)"
                strokeWidth={3}
                connectNulls={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
