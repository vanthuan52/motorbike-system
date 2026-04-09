"use client";

import { useState, useEffect, useRef } from "react";
import {
  SlidersHorizontal,
  ChevronDown,
  X,
  Star,
  ChevronDown as MoreIcon,
} from "lucide-react";
import { motion, useAnimation, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { TRANSLATION_FILES } from "@/lib/i18n";
import SectionHeading from "@/components/ui/section-heading";
import { formatPrice } from "@/utils/currency.helper";

/* ───────── Types ───────── */
type ServiceType =
  | "dai-tu-dong-co"
  | "son-xi-don-moi"
  | "bao-duong"
  | "sua-chua";

interface CareService {
  id: number;
  name: string;
  slug: string;
  type: ServiceType;
  rating: number;
  price: string;
  image: string;
  description: string;
}

/* ───────── Mock Data ───────── */
const ALL_SERVICES: CareService[] = [
  {
    id: 1,
    name: "Đại tu động cơ toàn bộ",
    slug: "dai-tu-dong-co",
    type: "dai-tu-dong-co",
    rating: 4.5,
    price: "2500000",
    image: "/images/care-service/dai-tu-dong-co.webp",
    description:
      "Tháo rời, kiểm tra và thay thế toàn bộ chi tiết hư hỏng trong động cơ.",
  },
  {
    id: 2,
    name: "Sơn-xi-dọn mới toàn xe",
    slug: "son-xi-don-moi",
    type: "son-xi-don-moi",
    rating: 4.7,
    price: "1800000",
    image: "/images/care-service/son-xi-don-moi.webp",
    description:
      "Phục hồi màu sơn nguyên bản, xi mạ sáng bóng, dọn sạch toàn diện.",
  },
  {
    id: 3,
    name: "Bảo dưỡng định kỳ",
    slug: "bao-duong",
    type: "bao-duong",
    rating: 4.8,
    price: "300000",
    image: "/images/care-service/bao-duong-xe-may.webp",
    description:
      "Thay dầu, kiểm tra phanh, lốp, đèn và các hệ thống quan trọng.",
  },
  {
    id: 4,
    name: "Sửa chữa tổng quát",
    slug: "sua-chua",
    type: "sua-chua",
    rating: 4.6,
    price: "200000",
    image: "/images/care-service/sua-chua.webp",
    description: "Chẩn đoán và sửa chữa mọi sự cố từ nhỏ đến phức tạp.",
  },
  {
    id: 5,
    name: "Thay nhớt cao cấp",
    slug: "bao-duong",
    type: "bao-duong",
    rating: 4.9,
    price: "250000",
    image: "/images/care-service/bao-duong-xe-may.webp",
    description: "Sử dụng nhớt nhập khẩu chính hãng, bảo vệ động cơ tối đa.",
  },
  {
    id: 6,
    name: "Thay lốp xe chính hãng",
    slug: "sua-chua",
    type: "sua-chua",
    rating: 4.4,
    price: "350000",
    image: "/images/care-service/sua-chua.webp",
    description: "Lốp chính hãng Michelin, Dunlop — lắp đặt nhanh gọn tại chỗ.",
  },
  {
    id: 7,
    name: "Đại tu hộp số",
    slug: "dai-tu-dong-co",
    type: "dai-tu-dong-co",
    rating: 4.3,
    price: "1500000",
    image: "/images/care-service/dai-tu-dong-co.webp",
    description: "Tháo rời, vệ sinh và thay thế bi, bánh răng hộp số bị mòn.",
  },
  {
    id: 8,
    name: "Sơn phục hồi dàn áo",
    slug: "son-xi-don-moi",
    type: "son-xi-don-moi",
    rating: 4.6,
    price: "1200000",
    image: "/images/care-service/son-xi-don-moi.webp",
    description:
      "Sơn lại các chi tiết dàn áo bị trầy xước, bạc màu theo thời gian.",
  },
];

const CATEGORIES = [
  { label: "Tất cả", value: "all" },
  { label: "Đại tu động cơ", value: "dai-tu-dong-co" },
  { label: "Sơn-xi-dọn mới", value: "son-xi-don-moi" },
  { label: "Bảo dưỡng", value: "bao-duong" },
  { label: "Sửa chữa", value: "sua-chua" },
];

const PRICE_RANGES = [
  { label: "Tất cả mức giá", value: "all" },
  { label: "Dưới 300.000đ", value: "0-300000" },
  { label: "300.000đ – 1.000.000đ", value: "300000-1000000" },
  { label: "1.000.000đ – 2.000.000đ", value: "1000000-2000000" },
  { label: "Trên 2.000.000đ", value: "2000000-999999999" },
];

const SORT_OPTIONS = [
  { label: "Liên quan nhất", value: "relevance" },
  { label: "Giá tăng dần", value: "price-asc" },
  { label: "Giá giảm dần", value: "price-desc" },
];



/* ───────── Dropdown Filter Button ───────── */
function FilterDropdown({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);
  const isFiltered = value !== "all";

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [open]);

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm transition-colors
          ${isFiltered ? "bg-primary-50 text-primary-700 font-medium" : "bg-gray-50 text-text-secondary hover:bg-gray-100 hover:text-text-primary"}`}
      >
        {isFiltered ? selected?.label : label}
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 min-w-[180px]">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2 text-sm transition-colors
                ${
                  opt.value === value
                    ? "text-primary-700 bg-primary-50 font-medium"
                    : "text-text-secondary hover:bg-gray-50 hover:text-text-primary"
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════ Main Section ═══════════════════════ */
const INITIAL_COUNT = 8;

export default function CareServiceBrowse() {
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sort, setSort] = useState("relevance");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const t = useTranslations(
    `${TRANSLATION_FILES.SERVICE_PAGE}.serviceListSection`,
  );

  const hasFilters = category !== "all" || priceRange !== "all";

  const clearFilters = () => {
    setCategory("all");
    setPriceRange("all");
    setSort("relevance");
    setSearch("");
  };

  // Filter
  let filtered = ALL_SERVICES;
  if (category !== "all")
    filtered = filtered.filter((s) => s.type === category);
  if (priceRange !== "all") {
    const [min, max] = priceRange.split("-").map(Number);
    filtered = filtered.filter((s) => {
      const p = parseInt(s.price, 10);
      return p >= min && p <= max;
    });
  }
  if (search) {
    filtered = filtered.filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase()),
    );
  }

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sort === "price-asc") return parseInt(a.price) - parseInt(b.price);
    if (sort === "price-desc") return parseInt(b.price) - parseInt(a.price);
    return 0;
  });

  return (
    <section className="py-16 bg-surface">
      <div className="container mx-auto">
        {/* Section Title */}
        <SectionHeading title="Dịch vụ chăm sóc xe máy" className="mb-12" />

        {/* ─── Horizontal Filter Bar (sticky within section) ─── */}
        <div className="sticky top-[72px] z-30 bg-surface/95 backdrop-blur-sm py-3 mb-5">
          <div className="flex flex-wrap items-center gap-2">
            {/* Filter icon label */}
            <div className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-text-primary bg-gray-100 rounded-lg">
              <SlidersHorizontal className="w-4 h-4" />
              Lọc
            </div>

            {/* Dropdowns */}
            <FilterDropdown
              label="Danh mục"
              options={CATEGORIES}
              value={category}
              onChange={setCategory}
            />

            <FilterDropdown
              label="Giá"
              options={PRICE_RANGES}
              value={priceRange}
              onChange={setPriceRange}
            />

            <FilterDropdown
              label="Sắp xếp"
              options={SORT_OPTIONS}
              value={sort}
              onChange={setSort}
            />

            {/* Clear - ngay sát bộ lọc */}
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Xoá lọc
              </button>
            )}
          </div>
        </div>

        {/* ─── Grid ─── */}
        {sorted.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {sorted.slice(0, visibleCount).map((service) => (
              <ZoomInServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-text-muted text-5xl mb-3">🔍</div>
            <p className="text-text-secondary text-sm">
              Không tìm thấy dịch vụ phù hợp
            </p>
          </div>
        )}

        {/* Load More */}
        {sorted.length > visibleCount && (
          <div className="flex justify-center mt-10">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 4)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary-700 text-white text-sm font-medium hover:bg-primary-800 shadow-sm transition-all"
            >
              Xem thêm ({sorted.length - visibleCount})
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ───────── ZoomInCard (matches service-list.tsx) ───────── */
function ZoomInServiceCard({ service }: { service: CareService }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5, ease: "easeOut" },
      });
    } else {
      controls.start({
        opacity: 0,
        scale: 0.9,
        transition: { duration: 0.3 },
      });
    }
  }, [inView, controls]);

  return (
    <Link
      href={`/dich-vu/${service.slug}`}
      title={service.name}
      className="group"
    >
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={controls}
        className="bg-surface shadow-[var(--shadow-lg)] rounded-[var(--radius-2xl)] overflow-hidden hover:shadow-[var(--shadow-xl-hover)] transition h-full flex flex-col"
      >
        <div className="relative h-52">
          <Image
            src={service.image}
            alt={service.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-700 transition-colors line-clamp-1">
            {service.name}
          </h3>
          <p className="text-sm text-text-secondary mb-3 line-clamp-2 flex-1">
            {service.description}
          </p>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-accent">
              <span className="font-medium text-sm">Từ </span>
              <span className="font-medium">{formatPrice(service.price)}</span>
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-accent fill-current" />
              <span className="text-sm font-medium text-text-primary">
                {service.rating}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
