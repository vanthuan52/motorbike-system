import React from "react";
import { CustomLink } from "@/shared/components/CustomerLink/CustomLink";
import { ROUTER_PATH } from "@/constant/router-path";

export default function HeroSection() {
  return (
    <section className="relative bg-white overflow-hidden">
      <div className="container py-10 flex flex-col md:flex-row items-center gap-10">
        <div className="w-full text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-6">
            Chăm sóc toàn diện <br className="hidden md:block" /> cho chiếc xe
            của bạn
          </h1>
          <p className="text-gray-600 text-lg md:text-xl mb-8">
            Bảo dưỡng – sửa chữa – thay thế phụ tùng chính hãng. Đặt lịch nhanh
            chóng, phục vụ chuyên nghiệp.
          </p>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <CustomLink href={ROUTER_PATH.MAINTAIN_REGISTRATION}>
              <button className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-md transition cursor-pointer">
                Đặt lịch ngay
              </button>
            </CustomLink>
            <CustomLink href={ROUTER_PATH.SERVICES}>
              <button className="border border-gray-800 text-gray-800 hover:bg-gray-100 font-semibold px-6 py-3 rounded-md transition cursor-pointer">
                Xem dịch vụ
              </button>
            </CustomLink>
          </div>
        </div>
        <div className="w-full h-full">
          <img
            src="/images/home-page/hero-banner-bike.jpg"
            alt="Hero image"
            className="w-full h-full mx-auto md:mx-0 rounded-md"
          />
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-red-100 to-transparent -z-10" />
    </section>
  );
}
