"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Shield,
  Clock,
  Wrench,
  PhoneCall,
  CalendarCheck,
  ChevronRight,
  Check,
  Award,
  Zap,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import {
  getServiceData,
  getRelatedServices,
  Service,
  RelatedService,
} from "@/features/vehicle-service/mocks/service-detail";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { SkeletonCard } from "@/features/vehicle-service/components/skeleton-card";
import SectionHeading from "@/components/ui/section-heading";
import { ImageLightbox, ZoomTrigger } from "@/features/vehicle-service/components/image-lightbox";
import { ServiceCard } from "@/features/vehicle-service/components/service-card";

const SERVICE_BADGES = [
  { icon: Shield, label: "Bảo hành 6 tháng" },
  { icon: Wrench, label: "Thợ chuyên nghiệp" },
  { icon: Clock, label: "Xử lý nhanh" },
  { icon: Award, label: "Phụ tùng chính hãng" },
];

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) ?? "";
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, [slug]);

  const serviceData: Service = getServiceData(slug);
  const relatedServices: RelatedService[] = getRelatedServices(slug);

  // Gallery thumbnails: use same image repeated for demo (expand with real data later)
  const gallery = [
    serviceData.image,
    serviceData.image,
    serviceData.image,
    serviceData.image,
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-alt">
        <div className="container py-10">
          <div className="h-5 w-64 bg-secondary-100 rounded-full mb-8 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-alt overflow-x-hidden">
      {/* ── HERO BACKGROUND GRADIENT ── */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-br from-primary-50 via-white to-surface-alt" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary-100/30 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 left-0 w-[300px] h-[300px] bg-secondary-100/20 rounded-full blur-[80px]" />
      </div>

      {/* ── MAIN CONTENT ── */}
      <section className="container pt-8 pb-24">
        {/* Breadcrumbs */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Breadcrumbs
            items={[
              { label: "Trang chủ", href: "/" },
              { label: "Dịch vụ", href: "/dich-vu" },
              { label: serviceData.name },
            ]}
            className="mb-10"
          />
        </motion.div>

        {/* ── HERO GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 xl:gap-16 items-start mb-24">
          {/* ── LEFT: IMAGE GALLERY ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col gap-4 lg:col-span-2"
          >
            {/* Main Image */}
            <div
              className="relative group aspect-[4/3] overflow-hidden rounded-2xl bg-white cursor-zoom-in"
              onClick={() => setLightboxOpen(true)}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={gallery[activeImage]}
                  alt={serviceData.name}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                />
              </AnimatePresence>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <ZoomTrigger />
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative overflow-hidden rounded-xl aspect-square transition-all duration-300 ${
                    activeImage === i
                      ? "ring-2 ring-primary-600 ring-offset-2 scale-95 shadow-md"
                      : "opacity-60 hover:opacity-100 hover:scale-95"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* ── RIGHT: INFO PANEL ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="flex flex-col gap-5 lg:col-span-3 lg:pt-2"
          >
            {/* Service Name */}
            <h1 className="text-2xl lg:text-3xl font-black text-text-primary leading-tight tracking-tight">
              {serviceData.name}
            </h1>

            {/* Rating Row */}
            <div className="flex items-center gap-5 flex-wrap">
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(serviceData.rating)
                        ? "fill-warning text-warning"
                        : "text-border"
                    }`}
                  />
                ))}
              </div>
              <span className="text-base font-bold text-text-primary">
                {serviceData.rating}
              </span>
              <span className="text-sm text-text-muted">
                ({serviceData.reviewCount} đánh giá)
              </span>
              <span className="h-4 w-px bg-border" />
              <span className="text-sm font-semibold text-success flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-success animate-pulse" />
                Đang phục vụ
              </span>
            </div>

            {/* Price */}
            <div className="rounded-xl bg-white px-5 py-4 flex items-center justify-between gap-4 shadow-2xs">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-text-muted mb-1">
                  Chi phí dự kiến
                </p>
                <p className="text-2xl font-black text-primary-600">
                  {serviceData.price}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-text-muted mb-1">Tiết kiệm đến</p>
                <p className="text-lg font-black text-success">15%</p>
                <p className="text-xs text-text-muted">khi đặt online</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-text-secondary text-[15px] leading-relaxed">
                {serviceData.description}
              </p>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3">
              {SERVICE_BADGES.map((badge, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-2xs"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                    <badge.icon className="w-4 h-4 text-primary-600" />
                  </div>
                  <span className="text-xs font-semibold text-text-primary leading-snug">
                    {badge.label}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <motion.button
                whileHover={{
                  y: -2,
                  boxShadow: "0 12px 30px -8px var(--color-primary-400)",
                }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex items-center justify-center gap-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-base py-4 px-6 rounded-xl transition-colors duration-200"
              >
                <CalendarCheck className="w-5 h-5" />
                Đặt Lịch Ngay
              </motion.button>
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex items-center justify-center gap-2.5 bg-white hover:bg-primary-50 text-primary-700 border-2 border-primary-100 hover:border-primary-300 font-bold text-base py-4 px-6 rounded-xl transition-all duration-200"
              >
                <PhoneCall className="w-5 h-5" />
                Tư Vấn Miễn Phí
              </motion.button>
            </div>

            {/* Reassurance strip */}
            <div className="flex items-center gap-3 flex-wrap text-xs text-text-muted pt-1">
              {[
                "Không phí ẩn",
                "Hủy lịch miễn phí",
                "Báo giá trước khi làm",
              ].map((t, i) => (
                <span key={i} className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-success" />
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── RELATED SERVICES ── */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <SectionHeading
              title="Có Thể Bạn Quan Tâm"
              align="left"
              className="!max-w-none !mb-0"
            />
            <Link
              href="/dich-vu"
              className="group shrink-0 inline-flex items-center gap-1.5 text-sm font-bold text-primary-600 hover:text-primary-800 transition-colors"
            >
              Xem tất cả dịch vụ
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </motion.section>
      </section>

      {/* ── LIGHTBOX ── */}
      <ImageLightbox
        images={gallery}
        currentIndex={activeImage}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setActiveImage}
        alt={serviceData.name}
      />
    </div>
  );
}
