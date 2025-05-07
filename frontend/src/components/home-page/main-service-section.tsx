"use client";

import Image from "next/image";
import React from "react";

interface Service {
  image: string;
  title: string;
  description: string;
}

const services: Service[] = [
  {
    image: "/images/services/repair.png",
    title: "Sửa chữa tổng quát",
    description:
      "Chẩn đoán và khắc phục mọi sự cố về động cơ, điện, hệ thống phanh, và truyền động.",
  },
  {
    image: "/images/services/oil-change.png",
    title: "Thay nhớt & bảo dưỡng",
    description:
      "Thay dầu định kỳ, vệ sinh lọc gió, kiểm tra tổng quát giúp xe hoạt động bền bỉ.",
  },
  {
    image: "/images/services/vehicle-wash.jpg",
    title: "Rửa & làm đẹp xe",
    description:
      "Vệ sinh chi tiết, tẩy rửa chuyên sâu, phủ bóng giúp xe sáng như mới.",
  },
  {
    image: "/images/services/spare-parts-replacement.jpg",
    title: "Thay thế phụ tùng",
    description:
      "Thay thế phụ tùng chính hãng, chất lượng cao, bảo hành đầy đủ.",
  },
];

export default function MainServicesSection() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
          Các Dịch Vụ Chính
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-100 rounded-xl shadow-md hover:shadow-lg transition duration-300"
            >
              <div className="relative h-60 w-full rounded-t-xl overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 25vw"
                  unoptimized
                />
              </div>
              <div className="p-5 text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-600">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center py-5 mt-5">
          <button className="border border-gray-800 text-gray-800 hover:bg-gray-100 font-semibold px-6 py-3 rounded-md transition cursor-pointer">
            Xem tất cả
          </button>
        </div>
      </div>
    </section>
  );
}
