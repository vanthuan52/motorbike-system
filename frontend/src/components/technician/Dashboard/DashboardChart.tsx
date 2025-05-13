"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const chartData = [
  { name: 1, value: 2 },
  { name: 2, value: 4 },
  { name: 3, value: 6 },
  { name: 4, value: 3 },
  { name: 5, value: 5 },
  { name: 6, value: 7 },
  { name: 7, value: 4 },
  { name: 8, value: 6 },
  { name: 9, value: 3 },
  { name: 10, value: 5 },
  { name: 11, value: 6 },
  { name: 12, value: 8 },
];

export default function TechnicianDashboardChart() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("Tháng");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const monthNames = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`);

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
      <div className="h-full border border-gray-200 rounded-lg flex flex-col">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-lg">
              Tiến độ công việc theo tháng
            </span>

            {/* Dropdown chọn tháng */}
            <div className="relative text-sm text-gray-600" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
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
                      className="w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      {month}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Biểu đồ */}
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="techGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="10%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} />
              <YAxis tickLine={false} ticks={[0, 2, 4, 6, 8]} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                fill="url(#techGradient)"
                strokeWidth={2}
                connectNulls
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
