"use client";
import { ClipboardList } from "lucide-react";

const tasks = Array(5).fill({
  title: "Bảo dưỡng xe Vision",
  time: "09:00 - 10:30",
  status: "Đang xử lý",
});

export default function TaskList() {
  return (
    <div className="h-full bg-white border border-[#E8E8E8] rounded-lg p-6">
      <span className="font-semibold text-lg">Nhiệm vụ hôm nay</span>
      <ul className="mt-6 space-y-4">
        {tasks.map((task, idx) => (
          <li key={idx} className="flex justify-between items-center">
            <div>
              <p className="font-medium">{task.title}</p>
              <p className="text-sm text-gray-500">{task.time}</p>
            </div>
            <span className="text-sm text-blue-600">{task.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
