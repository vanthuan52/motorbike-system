"use client";

import React from "react";
import { Car, ShieldCheck, Wrench, Timer, BadgeCheck } from "lucide-react";

const services = [
  {
    title: "Bảo Dưỡng Tổng Quát",
    icon: <Wrench className="w-8 h-8 text-white" />,
    description:
      "Kiểm tra và bảo trì toàn diện xe để đảm bảo an toàn vận hành.",
  },
  {
    title: "Thay Nhớt Định Kỳ",
    icon: <ShieldCheck className="w-8 h-8 text-white" />,
    description: "Sử dụng dầu nhớt chính hãng giúp động cơ hoạt động êm ái.",
  },
  {
    title: "Sửa Chữa Kỹ Thuật",
    icon: <Car className="w-8 h-8 text-white" />,
    description: "Xử lý các vấn đề kỹ thuật từ đơn giản đến phức tạp.",
  },
];

const reasons = [
  {
    title: "Phục vụ nhanh chóng",
    icon: <Timer className="w-6 h-6 text-indigo-600" />,
  },
  {
    title: "Bảo hành dài hạn",
    icon: <ShieldCheck className="w-6 h-6 text-indigo-600" />,
  },
  {
    title: "Phụ tùng chính hãng",
    icon: <BadgeCheck className="w-6 h-6 text-indigo-600" />,
  },
];

const FeaturedServices = () => {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container ">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Dịch Vụ Nổi Bật
        </h2>

        {/* Service cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="bg-indigo-600 text-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-center mb-4">
                <div className="bg-indigo-500 p-3 rounded-full">
                  {service.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">
                {service.title}
              </h3>
              <p className="text-center text-sm">{service.description}</p>
            </div>
          ))}
        </div>

        {/* Why choose us */}
        <h3 className="text-2xl font-semibold text-center text-gray-800 mb-8">
          Vì Sao Chọn Trung Tâm Chúng Tôi?
        </h3>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {reasons.map((reason, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 rounded-full">
                {reason.icon}
              </div>
              <p className="text-gray-700 font-medium">{reason.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;
