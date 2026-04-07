import { useTranslations } from "next-intl";

import { ROUTER_PATH } from "@/constant/router-path";
import { Link, TRANSLATION_FILES } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  const t = useTranslations(TRANSLATION_FILES.COMMON);

  return (
    <div className="flex items-center justify-center min-h-screen bg-surface px-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary-500/5 blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-primary-500/3 blur-2xl animate-pulse" />
      </div>

      <div className="relative z-10 text-center max-w-lg">
        {/* 404 Number */}
        <p
          className="text-[10rem] md:text-[12rem] font-black leading-none tracking-tighter text-transparent bg-clip-text select-none mb-6"
          style={{
            backgroundImage:
              "linear-gradient(135deg, var(--color-primary-500), var(--color-primary-300))",
          }}
        >
          404
        </p>

        {/* Message */}
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">
          {t("notFoundPage.title")}
        </h1>
        <p className="text-text-secondary mb-10 text-base leading-relaxed">
          {t("notFoundPage.description")}
        </p>

        {/* Actions */}
        <div className="flex gap-4 flex-wrap justify-center">
          <a
            href="javascript:history.back()"
            className="inline-flex items-center justify-center min-w-[160px] h-[52px] px-8 text-lg font-semibold rounded-[var(--radius-md)] border border-border text-primary-500 bg-transparent hover:bg-primary-50/50 transition-all cursor-pointer"
          >
            {t("notFoundPage.goBack")}
          </a>
          <Link
            href={ROUTER_PATH.HOME}
            className="inline-flex items-center justify-center min-w-[160px] h-[52px] px-8 text-lg font-semibold rounded-[var(--radius-md)] bg-primary-500 text-white shadow-[var(--shadow-primary)] hover:shadow-[var(--shadow-primary-hover)] transition-all"
          >
            {t("notFoundPage.home")}
          </Link>
        </div>
      </div>
    </div>
  );
}
