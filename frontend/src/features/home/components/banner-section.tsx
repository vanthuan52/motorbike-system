"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  BadgeDollarSign,
} from "lucide-react";

import { RootState, useAppDispatch } from "@/store";
import { bannerActions } from "@/features/banner/store/banner-slice";
import { useVehicleBrand } from "@/features/appointment/hooks/useVehicleBrand";
import { useVehicleModelByBrand } from "@/features/appointment/hooks/useVehicleModelByBrand";
import { useVehicleService } from "@/features/appointment/hooks/useVehicleService";
import VehicleModelModal from "@/app/[locale]/(web)/dang-ky-cham-soc-xe/_components/VehicleModelModal";
import ServiceSelectionModal from "@/app/[locale]/(web)/dang-ky-cham-soc-xe/_components/ServiceSelectionModal";
import { cn } from "@/utils/common.utils";
import { ROUTER_PATH } from "@/constant/router-path";
import { Link } from "@/lib/i18n";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function BannerSection() {
  const dispatch = useAppDispatch();
  const { banners, loading } = useSelector((state: RootState) => state.banner);
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    dispatch(bannerActions.getBanners());
  }, [dispatch]);

  if (loading) {
    return (
      <section className="relative w-full h-[80vh] bg-secondary-100 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
        </div>
      </section>
    );
  }

  if (!banners.length) return null;

  return (
    <section className="relative w-full" id="banner">
      {/* Slider */}
      <div className="relative h-[80vh] group">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={false}
          loop={banners.length > 1}
          speed={800}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setIsReady(true);
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="w-full h-full"
        >
          {banners.map((banner, index) => (
            <SwiperSlide key={banner._id} className="relative w-full h-full">
              <div className="absolute inset-0">
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  priority={index === 0}
                  className="object-cover"
                  sizes="100vw"
                  unoptimized
                />
                <div className="absolute inset-x-0 bottom-0 h-60 bg-gradient-to-t from-secondary-950/70 to-transparent" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Arrows */}
        {banners.length > 1 && isReady && (
          <>
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className={cn(
                "absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20",
                "flex size-12 items-center justify-center rounded-full",
                "bg-white/10 backdrop-blur-md border border-white/20 text-white",
                "opacity-0 group-hover:opacity-100",
                "hover:bg-white/20 active:scale-95",
                "transition-all duration-300 ease-out cursor-pointer",
              )}
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className={cn(
                "absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20",
                "flex size-12 items-center justify-center rounded-full",
                "bg-white/10 backdrop-blur-md border border-white/20 text-white",
                "opacity-0 group-hover:opacity-100",
                "hover:bg-white/20 active:scale-95",
                "transition-all duration-300 ease-out cursor-pointer",
              )}
              aria-label="Next slide"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Dots */}
        {banners.length > 1 && (
          <div className="absolute bottom-48 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => swiperRef.current?.slideToLoop(index)}
                className={cn(
                  "h-2 rounded-full transition-all duration-500 ease-out cursor-pointer",
                  activeIndex === index
                    ? "w-10 bg-primary-500 shadow-[0_0_12px_rgba(var(--color-primary-500-rgb,59,130,246),0.6)]"
                    : "w-2 bg-white/50 hover:bg-white/80",
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Service Price Lookup — overlapping banner */}
      <ServicePriceLookup />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Service Price Lookup                                               */
/* ------------------------------------------------------------------ */

function ServicePriceLookup() {
  // ---- Hooks (same as dang-ky-cham-soc-xe) ----
  const { vehicleBrands } = useVehicleBrand();
  const { vehicleServices } = useVehicleService();

  // ---- State ----
  const [localSelectedBrand, setLocalSelectedBrand] = useState<
    string | undefined
  >(undefined);
  const [selectedModel, setSelectedModel] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);

  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);

  // ---- Vehicle model hook (fetches when brand selected) ----
  const modelFilters = useMemo(() => ({ search: "" }), []);
  useVehicleModelByBrand(localSelectedBrand, modelFilters);

  // ---- Display values ----
  const brandName = localSelectedBrand
    ? vehicleBrands.find((b) => b._id === localSelectedBrand)?.name
    : "";
  const vehicleDisplayValue =
    brandName && selectedModel ? `${brandName} - ${selectedModel.label}` : "";

  const serviceDisplayValue =
    selectedServiceIds.length === 0
      ? ""
      : selectedServiceIds
          .map((id) => vehicleServices.find((s) => s._id === id)?.name)
          .filter(Boolean)
          .join(", ");

  // ---- Price calc ----
  const totalPrice = useMemo(() => {
    return vehicleServices
      .filter((s) => selectedServiceIds.includes(s._id))
      .reduce((sum, s) => sum + (s.basePrice || 0), 0);
  }, [vehicleServices, selectedServiceIds]);

  const estimatedTime =
    selectedModel && selectedServiceIds.length > 0 ? "45 – 60 phút" : "--";

  // ---- Reset service when vehicle changes ----
  useEffect(() => {
    setSelectedServiceIds([]);
  }, [selectedModel]);

  return (
    <>
      <div className="relative z-10 -mt-[200px]">
        <div className="container">
          <div className="rounded-2xl bg-white shadow-[0_12px_48px_rgba(0,0,0,0.15)] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-6 py-3.5 sm:px-8">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-wide uppercase">
                Tra cứu giá dịch vụ
              </h3>
            </div>

            {/* Body */}
            <div className="px-6 py-5 sm:px-8 sm:py-6">
              {/* Input Row — vehicle first, then service */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                {/* 1. Vehicle (opens VehicleModelModal) */}
                <div>
                  <label className="text-xs font-bold text-secondary-700 uppercase tracking-wider mb-1.5 block">
                    Dòng xe
                  </label>
                  <input
                    readOnly
                    value={vehicleDisplayValue}
                    placeholder="Chọn hãng xe và dòng xe..."
                    onClick={() => setVehicleModalOpen(true)}
                    className={cn(
                      "flex h-12 w-full rounded-xl border border-secondary-300 bg-secondary-50",
                      "px-4 text-sm font-medium text-secondary-900",
                      "outline-none transition-all duration-200 cursor-pointer",
                      "hover:border-primary-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20",
                      "placeholder:text-secondary-600",
                    )}
                  />
                </div>

                {/* 2. Service (opens ServiceSelectionModal) */}
                <div>
                  <label className="text-xs font-bold text-secondary-700 uppercase tracking-wider mb-1.5 block">
                    Gói dịch vụ
                  </label>
                  <input
                    readOnly
                    value={serviceDisplayValue}
                    placeholder={
                      selectedModel
                        ? "Chọn gói bảo dưỡng / sửa chữa..."
                        : "Vui lòng chọn dòng xe trước"
                    }
                    onClick={() => {
                      if (selectedModel) setServiceModalOpen(true);
                    }}
                    className={cn(
                      "flex h-12 w-full rounded-xl border border-secondary-300 bg-secondary-50",
                      "px-4 text-sm font-medium text-secondary-900",
                      "outline-none transition-all duration-200",
                      "placeholder:text-secondary-600",
                      selectedModel
                        ? "hover:border-primary-300 cursor-pointer"
                        : "opacity-50 cursor-not-allowed",
                    )}
                  />
                  {selectedServiceIds.length > 0 && (
                    <p className="text-[11px] text-secondary-700 mt-1">
                      Đã chọn {selectedServiceIds.length} dịch vụ
                    </p>
                  )}
                </div>
              </div>

              {/* Results Row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-0 pt-5 border-t border-secondary-100">
                {/* Estimated Time */}
                <div className="flex-1 flex items-center gap-3 sm:px-4">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary-50 flex-shrink-0">
                    <Clock size={18} className="text-primary-500" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-primary-600 uppercase tracking-wider">
                      Thời gian dự kiến
                    </p>
                    <p className="text-sm font-medium text-secondary-800 mt-0.5">
                      {estimatedTime}
                    </p>
                  </div>
                </div>

                <div className="hidden sm:block w-px self-stretch bg-secondary-200" />

                {/* Service Price */}
                <div className="flex-1 flex items-center gap-3 sm:px-4">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 flex-shrink-0">
                    <BadgeDollarSign size={18} className="text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-primary-600 uppercase tracking-wider">
                      Giá dịch vụ
                    </p>
                    <p className="text-xl font-bold text-secondary-800 mt-0.5 leading-none">
                      {totalPrice > 0
                        ? `${totalPrice.toLocaleString("vi-VN")}đ`
                        : "0đ"}
                    </p>
                    <p className="text-[11px] text-secondary-700 mt-0.5">
                      (Chưa bao gồm phụ tùng thay thế hoặc phát sinh)
                    </p>
                  </div>
                </div>

                <div className="hidden sm:block w-px self-stretch bg-secondary-200" />

                {/* CTA */}
                <div className="flex-shrink-0 sm:pl-6">
                  <Link
                    href={ROUTER_PATH.CARE_REGISTRATION}
                    className={cn(
                      "w-full sm:w-auto inline-flex items-center justify-center gap-2",
                      "px-8 py-3.5 rounded-xl",
                      "bg-primary-600 text-white font-bold text-sm uppercase tracking-wider",
                      "shadow-[0_4px_16px_rgba(var(--color-primary-500-rgb,59,130,246),0.35)]",
                      "hover:bg-primary-700 hover:shadow-[0_6px_24px_rgba(var(--color-primary-500-rgb,59,130,246),0.45)]",
                      "hover:-translate-y-0.5 active:translate-y-0",
                      "transition-all duration-300 ease-out",
                    )}
                  >
                    Đặt lịch ngay
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Model Modal (same as dang-ky-cham-soc-xe) */}
      <VehicleModelModal
        open={vehicleModalOpen}
        onClose={() => setVehicleModalOpen(false)}
        onSubmit={(vehicle) => {
          setSelectedModel(vehicle);
          setVehicleModalOpen(false);
        }}
        localSelectedBrand={localSelectedBrand}
        setLocalSelectedBrand={setLocalSelectedBrand}
      />

      {/* Service Selection Modal (same as dang-ky-cham-soc-xe) */}
      <ServiceSelectionModal
        open={serviceModalOpen}
        onClose={() => setServiceModalOpen(false)}
        selectedServices={selectedServiceIds}
        onSubmit={(ids) => {
          setSelectedServiceIds(ids);
        }}
      />
    </>
  );
}
