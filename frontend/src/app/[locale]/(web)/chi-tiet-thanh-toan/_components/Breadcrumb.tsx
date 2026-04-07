import { useTranslations } from "next-intl";
import { Link, TRANSLATION_FILES } from "@/lib/i18n";

export default function Breadcrumb() {
  const t = useTranslations(TRANSLATION_FILES.CHECKOUT_PAGE);

  return (
    <div className="flex flex-wrap items-center text-base gap-2 mb-10 sm:text-sm sm:gap-1">
      <li className="flex items-center gap-1 group">
        <span className="rounded-full border-2 border-border w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center bg-surface-alt transition-colors group-hover:border-primary-700 group-hover:text-primary-700 text-base sm:text-sm">
          1
        </span>
        <Link
          href="/gio-hang"
          className="ml-2 sm:ml-1 text-text-muted transition-colors group-hover:!text-primary-700"
        >
          <span className="hidden sm:block">{t("breadcrumb.cart")}</span>
          <span className="block sm:hidden">{t("breadcrumb.cartShort")}</span>
        </Link>
      </li>
      <span className="mx-2 text-text-muted sm:mx-1">&gt;</span>
      <li className="flex items-center gap-1 group text-primary-700">
        <span className="rounded-full border-2 border-primary-700 w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center bg-surface shadow-[var(--shadow-sm)] transition-colors text-base sm:text-sm">
          2
        </span>
        <Link href="/chi-tiet-thanh-toan" className="ml-2 sm:ml-1 ">
          <span className="hidden sm:block">{t("breadcrumb.checkout")}</span>
          <span className="block sm:hidden">
            {t("breadcrumb.checkoutShort")}
          </span>
        </Link>
      </li>
      <span className="mx-2 text-text-muted sm:mx-1">&gt;</span>
      <li className="flex items-center gap-1 text-text-muted">
        <span className="rounded-full border-2 border-border w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center bg-surface-alt text-base sm:text-sm">
          3
        </span>
        <span className="ml-2 sm:ml-1">
          <span className="hidden sm:block">{t("breadcrumb.complete")}</span>
          <span className="block sm:hidden">
            {t("breadcrumb.completeShort")}
          </span>
        </span>
      </li>
    </div>
  );
}
