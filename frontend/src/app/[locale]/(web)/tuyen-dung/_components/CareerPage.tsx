"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  ChevronRight,
  Users,
  Building2,
  Sparkles,
  Heart,
  TrendingUp,
  GraduationCap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import { RootState } from "@/store";
import { hiringActions } from "@/features/hiring/store/hiring-slice";
import { ENUM_HIRING_JOB_TYPE, Hiring } from "@/features/hiring/types";
import { useDebounce } from "@/hooks/useDebounce";
import { Link } from "@/lib/i18n";
import { ROUTER_PATH } from "@/constant/router-path";

const JOB_TYPE_LABELS: Record<string, string> = {
  [ENUM_HIRING_JOB_TYPE.FULL_TIME]: "Toàn thời gian",
  [ENUM_HIRING_JOB_TYPE.PART_TIME]: "Bán thời gian",
  [ENUM_HIRING_JOB_TYPE.CONTRACT]: "Hợp đồng",
  [ENUM_HIRING_JOB_TYPE.ETC]: "Khác",
};

const CATEGORY_COLORS: Record<string, string> = {
  "Kỹ thuật": "bg-blue-50 text-blue-600 border-blue-200",
  "Bán hàng": "bg-emerald-50 text-emerald-600 border-emerald-200",
  "Kế toán": "bg-amber-50 text-amber-600 border-amber-200",
  Marketing: "bg-pink-50 text-pink-600 border-pink-200",
  CSKH: "bg-violet-50 text-violet-600 border-violet-200",
  "Kho vận": "bg-cyan-50 text-cyan-600 border-cyan-200",
};

const PERKS = [
  {
    icon: Heart,
    title: "Bảo hiểm đầy đủ",
    desc: "BHXH, BHYT, BHTN theo quy định",
  },
  {
    icon: TrendingUp,
    title: "Lộ trình thăng tiến",
    desc: "Cơ hội phát triển rõ ràng",
  },
  {
    icon: GraduationCap,
    title: "Đào tạo chuyên môn",
    desc: "Đào tạo kỹ năng miễn phí",
  },
  {
    icon: Sparkles,
    title: "Thưởng hiệu suất",
    desc: "Thưởng KPI và thưởng dự án",
  },
];

/* ──────────── Job Card ──────────── */
function JobCard({ job, index }: { job: Hiring; index: number }) {
  const catColor =
    CATEGORY_COLORS[job.category] ||
    "bg-secondary-100 text-text-secondary border-border";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`${ROUTER_PATH.HIRING}/${job.slug}`}>
        <div className="group relative bg-surface rounded-xl border border-border p-5 hover:border-primary-300 hover:shadow-md transition-all duration-200 cursor-pointer">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-text-primary group-hover:text-primary-500 transition-colors line-clamp-1">
                {job.title}
              </h3>
              <p className="text-sm text-text-muted line-clamp-2 mt-1">
                {job.description}
              </p>
            </div>
            <ChevronRight
              size={18}
              className="text-text-muted group-hover:text-primary-500 flex-shrink-0 mt-1 transition-colors"
            />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border ${catColor}`}
            >
              {job.category}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-text-muted">
              <Briefcase size={12} />
              {JOB_TYPE_LABELS[job.jobType] || job.jobType}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-text-muted">
              <MapPin size={12} />
              {job.location}
            </span>
            {job.salaryRange && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-500 ml-auto">
                {job.salaryRange} ₫
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ──────────── Skeleton ──────────── */
function JobCardSkeleton() {
  return (
    <div className="bg-surface rounded-xl border border-border p-5 animate-pulse">
      <div className="h-4 w-2/3 bg-secondary-100 rounded mb-2" />
      <div className="h-3 w-full bg-secondary-100 rounded mb-3" />
      <div className="flex gap-2">
        <div className="h-6 w-16 bg-secondary-100 rounded-lg" />
        <div className="h-6 w-24 bg-secondary-100 rounded-lg" />
        <div className="h-6 w-20 bg-secondary-100 rounded-lg" />
      </div>
    </div>
  );
}

/* ──────────── Main Page ──────────── */
export default function CareerPage() {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const debouncedSearch = useDebounce(search, 500);

  const { hiringList, loading, pagination } = useSelector(
    (state: RootState) => state.hiring
  );

  useEffect(() => {
    dispatch(
      hiringActions.getHiringList({
        search: debouncedSearch,
        page: 1,
        perPage: 20,
      })
    );
  }, [dispatch, debouncedSearch]);

  // Client-side category filter
  const categories = [
    "all",
    ...Array.from(new Set(hiringList.map((h) => h.category))),
  ];

  const filteredJobs =
    activeCategory === "all"
      ? hiringList
      : hiringList.filter((h) => h.category === activeCategory);

  return (
    <div className="bg-bg-soft min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700">
        {/* Decorative */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10 py-16 md:py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-white/90 text-sm font-medium backdrop-blur-sm mb-5">
                <Sparkles size={14} />
                Đang tuyển {hiringList.length} vị trí
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
                Gia nhập đội ngũ
                <br />
                <span className="text-primary-200">Ant Motor</span>
              </h1>
              <p className="text-base md:text-lg text-white/80 max-w-lg mb-8">
                Chúng tôi tìm kiếm những ứng viên tài năng, nhiệt huyết để cùng
                phát triển dịch vụ xe máy hàng đầu Việt Nam.
              </p>

              {/* Search */}
              <div className="relative max-w-md">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm kiếm vị trí..."
                  className="w-full h-12 pl-11 pr-4 rounded-xl bg-white text-sm text-text-primary placeholder:text-text-muted shadow-lg outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
            </motion.div>

            <motion.div
              className="hidden lg:flex justify-end"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Image
                src="/images/motorbike/about-career.png"
                alt="Career at Ant Motor"
                width={450}
                height={320}
                className="rounded-2xl object-cover shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="container -mt-8 relative z-10 mb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PERKS.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-surface rounded-xl border border-border p-4 shadow-sm"
            >
              <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center mb-2.5">
                <Icon size={18} className="text-primary-500" />
              </div>
              <p className="text-sm font-bold text-text-primary">{title}</p>
              <p className="text-xs text-text-muted mt-0.5">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About + Jobs */}
      <section className="container pb-20">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar — Company Info */}
          <div className="space-y-5">
            <div className="bg-surface rounded-xl border border-border p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-secondary-900 rounded-xl flex items-center justify-center">
                  <Image
                    src="/images/logo/logo.jpg"
                    alt="Logo"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary">
                    Ant Motor
                  </h3>
                  <p className="text-xs text-text-muted">
                    Dịch vụ xe máy hàng đầu
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 text-sm">
                <div className="flex items-center gap-2 text-text-secondary">
                  <Building2 size={14} className="text-text-muted" />
                  Dịch vụ xe máy
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                  <Users size={14} className="text-text-muted" />
                  100 - 500 nhân sự
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                  <MapPin size={14} className="text-text-muted" />
                  Hà Nội, Việt Nam
                </div>
              </div>
            </div>

            {/* Why us */}
            <div className="bg-surface rounded-xl border border-border p-5">
              <h4 className="text-sm font-bold text-text-primary mb-3">
                Tại sao chọn chúng tôi?
              </h4>
              <ul className="space-y-2.5 text-sm text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                  Môi trường làm việc năng động, thân thiện
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                  Lương thưởng cạnh tranh trên thị trường
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                  Đào tạo và phát triển liên tục
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                  Team building hàng quý
                </li>
              </ul>
            </div>
          </div>

          {/* Main — Job Listings */}
          <div>
            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-5 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                    activeCategory === cat
                      ? "bg-primary-500 text-white shadow-sm"
                      : "bg-surface border border-border text-text-secondary hover:border-primary-300"
                  }`}
                >
                  {cat === "all" ? "Tất cả" : cat}
                </button>
              ))}
            </div>

            {/* Results header */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-text-muted">
                {loading ? (
                  "Đang tải..."
                ) : (
                  <>
                    Tìm thấy{" "}
                    <span className="font-bold text-text-primary">
                      {filteredJobs.length}
                    </span>{" "}
                    vị trí
                  </>
                )}
              </p>
            </div>

            {/* Job list */}
            <div className="space-y-3">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <JobCardSkeleton key={i} />
                ))
              ) : filteredJobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Search size={40} className="text-text-muted mb-3" />
                  <p className="text-base font-semibold text-text-primary mb-1">
                    Không tìm thấy vị trí nào
                  </p>
                  <p className="text-sm text-text-muted">
                    Thử thay đổi từ khóa hoặc bộ lọc
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  {filteredJobs.map((job, i) => (
                    <JobCard key={job._id} job={job} index={i} />
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
