"use client";

import Image from "next/image";
import { Link } from "@/lib/i18n";
import { CalendarCheck, Phone, Shield, Clock } from "lucide-react";

const highlights = [
  {
    icon: Shield,
    title: "Bảo hành chính hãng",
    desc: "Cam kết bảo hành từ 3-12 tháng cho mọi dịch vụ",
  },
  {
    icon: Clock,
    title: "Nhanh chóng",
    desc: "Hoàn thành trong ngày, không chờ đợi lâu",
  },
  {
    icon: CalendarCheck,
    title: "Đặt lịch linh hoạt",
    desc: "Đặt lịch online 24/7, chọn khung giờ phù hợp",
  },
  {
    icon: Phone,
    title: "Tư vấn miễn phí",
    desc: "Đội ngũ kỹ thuật sẵn sàng giải đáp mọi thắc mắc",
  },
];

export default function ServiceCTA() {
  return (
    <section className="mt-16">
      {/* CTA Banner */}
      <div className="relative rounded-[var(--radius-2xl)] overflow-hidden">
        <Image
          src="/images/services/service-hero.png"
          alt="Đặt lịch chăm sóc xe"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />

        <div className="relative z-10 px-8 py-14 md:py-20 md:px-14 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="max-w-xl">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Đặt lịch chăm sóc xe ngay hôm nay
            </h2>
            <p className="text-white/80 text-base md:text-lg">
              Đội ngũ kỹ thuật viên giàu kinh nghiệm, trang thiết bị hiện đại — sẵn sàng phục vụ bạn.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/dang-ky-cham-soc-xe"
              className="inline-flex items-center justify-center gap-2 bg-primary-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-800 transition-colors shadow-lg"
            >
              <CalendarCheck className="w-5 h-5" />
              Đặt lịch ngay
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 border border-white/40 text-white px-6 py-3 rounded-full font-medium hover:bg-white/10 transition-colors"
            >
              <Phone className="w-5 h-5" />
              Liên hệ tư vấn
            </Link>
          </div>
        </div>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
        {highlights.map((item, idx) => (
          <div
            key={idx}
            className="flex items-start gap-4 p-5 bg-surface border border-border rounded-[var(--radius-xl)] hover:shadow-[var(--shadow-md)] transition-shadow duration-200"
          >
            <div className="shrink-0 w-10 h-10 rounded-[var(--radius-lg)] bg-primary-50 flex items-center justify-center">
              <item.icon className="w-5 h-5 text-primary-700" />
            </div>
            <div>
              <h4 className="font-semibold text-text-primary text-sm mb-1">
                {item.title}
              </h4>
              <p className="text-text-secondary text-xs leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
