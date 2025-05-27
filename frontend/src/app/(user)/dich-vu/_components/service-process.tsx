"use client";

import {
  Wrench,
  CalendarCheck,
  Search,
  ClipboardList,
  CheckCircle,
} from "lucide-react";

const steps = [
  {
    title: "Đặt lịch",
    description:
      "Khách hàng đặt lịch hẹn nhanh chóng qua website hoặc hotline.",
    icon: <CalendarCheck className="w-8 h-8 text-yellow-500" />,
  },
  {
    title: "Tiếp nhận & kiểm tra",
    description: "Nhân viên tiếp nhận xe, kiểm tra tình trạng hiện tại.",
    icon: <Search className="w-8 h-8 text-yellow-500" />,
  },
  {
    title: "Tư vấn & báo giá",
    description:
      "Báo giá minh bạch, giải thích chi tiết các công việc cần làm.",
    icon: <ClipboardList className="w-8 h-8 text-yellow-500" />,
  },
  {
    title: "Sửa chữa & bảo dưỡng",
    description: "Kỹ thuật viên tiến hành sửa chữa với thiết bị hiện đại.",
    icon: <Wrench className="w-8 h-8 text-yellow-500" />,
  },
  {
    title: "Bàn giao & bảo hành",
    description:
      "Xe được kiểm tra lần cuối, bàn giao sạch sẽ, bảo hành đầy đủ.",
    icon: <CheckCircle className="w-8 h-8 text-yellow-500" />,
  },
];

export default function ServiceProcess() {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-12">
          Quy trình bảo dưỡng chuyên nghiệp
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-xl transition"
            >
              <div className="flex items-center mb-4 space-x-3">
                <div className="flex-shrink-0">{step.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {step.title}
                </h3>
              </div>
              <p className="text-sm text-gray-600">{step.description}</p>
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-400 text-white rounded-full flex items-center justify-center font-bold shadow">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
