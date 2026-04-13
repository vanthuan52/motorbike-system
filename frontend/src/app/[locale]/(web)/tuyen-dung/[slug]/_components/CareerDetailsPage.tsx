"use client";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  CalendarDays,
  CheckCircle2,
  Building2,
} from "lucide-react";

import { Link, TRANSLATION_FILES } from "@/lib/i18n";
import { ROUTER_PATH } from "@/constant/router-path";
import { hiringActions } from "@/features/hiring/store/hiring-slice";
import { RootState } from "@/store";
import { ENUM_HIRING_JOB_TYPE } from "@/features/hiring/types";
import ApplicationForm from "./ApplicationForm";

const JOB_TYPE_LABELS: Record<string, string> = {
  [ENUM_HIRING_JOB_TYPE.FULL_TIME]: "Toàn thời gian",
  [ENUM_HIRING_JOB_TYPE.PART_TIME]: "Bán thời gian",
  [ENUM_HIRING_JOB_TYPE.CONTRACT]: "Hợp đồng",
  [ENUM_HIRING_JOB_TYPE.ETC]: "Khác",
};

/* Skeleton */
function DetailSkeleton() {
  return (
    <div className="bg-bg-soft min-h-screen">
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 py-16">
        <div className="container">
          <div className="h-5 w-20 bg-white/20 rounded mb-6 animate-pulse" />
          <div className="h-8 w-96 bg-white/20 rounded mb-3 animate-pulse" />
          <div className="flex gap-3 mt-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-8 w-28 bg-white/15 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
      <div className="container py-10">
        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-surface rounded-xl p-6 animate-pulse">
                <div className="h-5 w-40 bg-secondary-100 rounded mb-3" />
                <div className="space-y-2">
                  <div className="h-3 w-full bg-secondary-100 rounded" />
                  <div className="h-3 w-3/4 bg-secondary-100 rounded" />
                </div>
              </div>
            ))}
          </div>
          <div className="h-96 bg-surface rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function CareerDetailsPage() {
  const t = useTranslations(TRANSLATION_FILES.HIRING_DETAIL);
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useDispatch();
  const { hiringDetail: job, loading } = useSelector(
    (state: RootState) => state.hiring
  );

  useEffect(() => {
    dispatch(hiringActions.getHiringDetail({ hiringId: slug ?? "" }));
  }, [dispatch, slug]);

  if (loading) return <DetailSkeleton />;

  if (!job) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <Briefcase size={48} className="text-text-muted mb-3" />
        <p className="text-lg font-semibold text-text-primary">
          Không tìm thấy công việc
        </p>
        <Link
          href={ROUTER_PATH.HIRING}
          className="mt-4 text-sm text-primary-500 hover:underline"
        >
          ← Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-bg-soft min-h-screen">
      {/* Hero Header */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-600 py-12 md:py-16">
        <div className="container">
          <Link
            href={ROUTER_PATH.HIRING}
            className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white mb-5 transition-colors"
          >
            <ArrowLeft size={16} />
            {t("back")}
          </Link>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-4">
            {job.title}
          </h1>

          <div className="flex flex-wrap gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 text-white text-sm font-medium backdrop-blur-sm">
              <Briefcase size={14} />
              {JOB_TYPE_LABELS[job.jobType] || job.jobType}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 text-white text-sm font-medium backdrop-blur-sm">
              <MapPin size={14} />
              {job.location}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 text-white text-sm font-medium backdrop-blur-sm">
              <Building2 size={14} />
              {job.category}
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container py-10">
        <div className="grid lg:grid-cols-[1fr_560px] gap-8 items-start">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {job.salaryRange && (
                <div className="bg-surface rounded-xl border border-border p-4">
                  <div className="flex items-center gap-2 text-text-muted text-xs mb-1">
                    <DollarSign size={14} />
                    Mức lương
                  </div>
                  <p className="text-sm font-bold text-primary-500">
                    {job.salaryRange} ₫
                  </p>
                </div>
              )}
              {job.applicationDeadline && (
                <div className="bg-surface rounded-xl border border-border p-4">
                  <div className="flex items-center gap-2 text-text-muted text-xs mb-1">
                    <CalendarDays size={14} />
                    Hạn nộp
                  </div>
                  <p className="text-sm font-bold text-text-primary">
                    {new Date(job.applicationDeadline).toLocaleDateString(
                      "vi-VN"
                    )}
                  </p>
                </div>
              )}
              <div className="bg-surface rounded-xl border border-border p-4">
                <div className="flex items-center gap-2 text-text-muted text-xs mb-1">
                  <Clock size={14} />
                  Hình thức
                </div>
                <p className="text-sm font-bold text-text-primary">
                  {JOB_TYPE_LABELS[job.jobType] || job.jobType}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-surface rounded-xl border border-border p-6">
              <h2 className="text-base font-bold text-text-primary mb-3">
                {t("descriptionTitle")}
              </h2>
              <p className="text-sm text-text-secondary whitespace-pre-line leading-relaxed">
                {job.description}
              </p>
            </div>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="bg-surface rounded-xl border border-border p-6">
                <h2 className="text-base font-bold text-text-primary mb-3">
                  {t("requirementsTitle")}
                </h2>
                <ul className="space-y-2.5">
                  {job.requirements.map((req, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm text-text-secondary"
                    >
                      <CheckCircle2
                        size={16}
                        className="text-primary-500 flex-shrink-0 mt-0.5"
                      />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* About Us */}
            <div className="bg-surface rounded-xl border border-border p-6">
              <h2 className="text-base font-bold text-text-primary mb-3">
                {t("aboutUsTitle")}
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                {t("aboutUsDesc")}
              </p>
            </div>
          </div>

          {/* Sidebar — Application Form */}
          <div className="lg:sticky lg:top-6">
            <div className="bg-surface rounded-xl border border-border p-6">
              <h2 className="text-base font-bold text-text-primary mb-4">
                {t("application_form")}
              </h2>
              <ApplicationForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
