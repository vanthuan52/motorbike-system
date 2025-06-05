"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

const recentOrders = Array(7).fill({
  customer: "Jenny Wilson",
  date: "28 - 03 - 2025",
  staff: "Nguyễn Văn A",
  status: "Completed",
});

export default function RecentOrders() {
  return (
    <div className="h-full rounded-lg border border-[#E8E8E8] bg-white p-6">
      <div className="flex items-center justify-between  p-4">
        <span className="font-semibold mb-6 text-lg !p-0 !m-0">
          Các đơn bảo dưỡng gần đây
        </span>
        <button className="text-gray-400 hover:text-gray-500">
          <MoreHorizontal size={24} />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-100 text-sm text-gray-500">
            <tr>
              <th className="whitespace-nowrap px-4 py-3 text-sm text-[#a9a9a9] font-[poppins] text-left">
                Khách hàng
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-sm text-[#a9a9a9] font-[poppins] text-center">
                Ngày bảo dưỡng
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-sm text-[#a9a9a9] font-[poppins] text-center">
                Nhân viên phụ trách
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-sm text-[#a9a9a9] font-[poppins] text-center">
                Trạng thái
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-sm text-[#a9a9a9] font-[poppins] text-center">
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order, idx) => (
              <tr key={idx} className="text-sm">
                <td className="whitespace-nowrap px-4 py-4 font-medium text-gray-900">
                  {order.customer}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-gray-700 text-center">
                  {order.date}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-gray-700 text-center">
                  {order.staff}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-gray-700 text-center">
                  {order.status}
                </td>
                <td className="whitespace-nowrap px-4 py-4">
                  <div className="flex items-center justify-center gap-3">
                    <button className="text-gray-400 transition-colors hover:text-[#F97316]">
                      <Pencil size={18} />
                    </button>
                    <button className="transition-colors text-[#F97316]">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
