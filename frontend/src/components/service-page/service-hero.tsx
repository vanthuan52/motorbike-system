"use client";

import Image from "next/image";

export default function ServiceHero() {
  return (
    <section className="relative bg-gray-900 text-white overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/services/service-hero.png"
          alt="Dịch vụ sửa chữa xe máy"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
      </div>

      <div className="relative z-10 container py-24 flex flex-col justify-center items-start text-left ">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          Dịch vụ bảo dưỡng & sửa chữa xe máy chuyên nghiệp
        </h1>
        <p className="text-lg md:text-xl mb-8 leading-relaxed text-gray-200">
          Đội ngũ kỹ thuật tay nghề cao – Phụ tùng chính hãng – Quy trình minh
          bạch
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="#pricing"
            className="bg-red-400 text-black px-6 py-3 rounded-full font-semibold hover:bg-red-300 transition"
          >
            Xem bảng giá
          </a>
          <a
            href="/dat-lich"
            className="border border-white text-white px-6 py-3 rounded-full hover:bg-white hover:text-black transition"
          >
            Đặt lịch ngay
          </a>
        </div>
      </div>
    </section>
  );
}
