import { useTranslations } from "next-intl";
import { CustomLink } from "@/components/CustomerLink/CustomLink";

export default function Breadcrumb() {
  const t = useTranslations("checkoutPage.breadcrumb");

  return (
    <div className="flex flex-wrap items-center text-base gap-2 mb-10 sm:text-sm sm:gap-1">
      <li className="flex items-center gap-1 group">
        <span className="rounded-full border-2 border-gray-300 w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center bg-gray-50 transition-colors group-hover:border-orange-500 group-hover:text-orange-500 text-base sm:text-sm">
          1
        </span>
        <CustomLink
          href="/gio-hang"
          className="ml-2 sm:ml-1 text-gray-400 transition-colors group-hover:!text-orange-500"
        >
          <span className="hidden sm:block">{t("cart")}</span>
          <span className="block sm:hidden">{t("cartShort")}</span>
        </CustomLink>
      </li>
      <span className="mx-2 text-gray-400 sm:mx-1">&gt;</span>
      <li className="flex items-center gap-1 group text-orange-500">
        <span className="rounded-full border-2 border-orange-500 w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center bg-white shadow transition-colors text-base sm:text-sm">
          2
        </span>
        <CustomLink href="/chi-tiet-thanh-toan" className="ml-2 sm:ml-1 ">
          <span className="hidden sm:block">{t("checkout")}</span>
          <span className="block sm:hidden">{t("checkoutShort")}</span>
        </CustomLink>
      </li>
      <span className="mx-2 text-gray-400 sm:mx-1">&gt;</span>
      <li className="flex items-center gap-1 text-gray-400">
        <span className="rounded-full border-2 border-gray-300 w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center bg-gray-50 text-base sm:text-sm">
          3
        </span>
        <span className="ml-2 sm:ml-1">
          <span className="hidden sm:block">{t("complete")}</span>
          <span className="block sm:hidden">{t("completeShort")}</span>
        </span>
      </li>
    </div>
  );
}
