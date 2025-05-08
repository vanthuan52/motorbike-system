"use client";

import React from "react";
import { Wrench, Workflow } from "lucide-react";

const technologies = [
  {
    title: "Máy chẩn đoán lỗi điện tử",
    description:
      "Sử dụng công nghệ OBD-II giúp phát hiện lỗi chính xác và nhanh chóng.",
    image: "/images/about/obd.jpg",
  },
  {
    title: "Thiết bị cân chỉnh góc lái 3D",
    description:
      "Đảm bảo độ chính xác tuyệt đối trong cân chỉnh hệ thống lái và treo.",
    image: "/images/about/alignment.jpg",
  },
  {
    title: "Máy thay nhớt tự động",
    description:
      "Giảm thời gian bảo dưỡng, đảm bảo lượng nhớt thay đúng chuẩn.",
    image: "/images/about/oil-change-device.jpg",
  },
];

const workflowSteps = [
  "Tiếp nhận và kiểm tra tổng quát tình trạng xe",
  "Chẩn đoán bằng máy móc hiện đại",
  "Tư vấn phương án sửa chữa phù hợp",
  "Tiến hành bảo dưỡng theo quy trình chuẩn",
  "Kiểm tra lại và bàn giao xe cho khách hàng",
];

const TechnologySection = () => {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
          Công Nghệ & Thiết Bị
        </h2>

        {/* Technologies */}
        <div className="grid md:grid-cols-3 gap-10 mb-20">
          {technologies.map((tech, idx) => (
            <div
              key={idx}
              className="bg-gray-50 rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={tech.image}
                alt={tech.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {tech.title}
                </h3>
                <p className="text-gray-600 text-sm">{tech.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-indigo-50 p-10 rounded-xl shadow-md">
          <h3 className="text-2xl font-semibold text-indigo-800 mb-6 flex items-center gap-2">
            <Workflow className="w-6 h-6" /> Quy Trình Bảo Dưỡng Chuẩn
          </h3>
          <ol className="list-decimal list-inside text-gray-700 space-y-3 text-base">
            {workflowSteps.map((step, idx) => (
              <li key={idx} className="leading-relaxed">
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default TechnologySection;
