"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type Service = {
  name: string;
  price: string;
  note?: string;
};

const services: Service[] = [
  {
    name: "Thay nhớt máy",
    price: "Từ 99K",
    note: "Tùy theo loại nhớt và dung tích xe",
  },
  {
    name: "Bảo dưỡng tổng thể",
    price: "Từ 299K",
    note: "Bao gồm vệ sinh, siết ốc, kiểm tra toàn bộ hệ thống",
  },
  {
    name: "Thay bugi, lọc gió",
    price: "Từ 120K",
    note: "Khuyến nghị mỗi 8.000 - 10.000km",
  },
  {
    name: "Sửa phanh, thay má phanh",
    price: "Từ 150K",
    note: "Tùy loại má phanh và dòng xe",
  },
  {
    name: "Kiểm tra & sửa điện, đèn, còi",
    price: "Từ 50K",
    note: "Tùy mức độ hư hỏng & thay thế",
  },
];

export default function PriceTable() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-gray-100">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-10">
          Bảng giá dịch vụ
        </h2>

        <div className="space-y-4">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden transition"
            >
              <button
                onClick={() => toggle(index)}
                className="flex justify-between items-center w-full px-6 py-4 text-left focus:outline-none"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {service.name}
                  </h3>
                  <p className="text-sm text-gray-500">{service.price}</p>
                </div>
                {openIndex === index ? (
                  <ChevronUp className="w-6 h-6 text-gray-500" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-500" />
                )}
              </button>

              {openIndex === index && (
                <div className="px-6 pb-4 text-sm text-gray-600">
                  {service.note}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
