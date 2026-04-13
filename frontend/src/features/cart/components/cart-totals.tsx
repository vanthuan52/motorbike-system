"use client";

import { useTranslations } from "next-intl";
import { ArrowRight, ShoppingBag } from "lucide-react";

import { Link, TRANSLATION_FILES } from "@/lib/i18n";

export default function CartTotals({ subtotal }: { subtotal: number }) {
  const t = useTranslations(TRANSLATION_FILES.CART_PAGE);
  const shipping = subtotal > 0 ? 45000 : 0;
  const total = subtotal + shipping;
  const isEmpty = total === 0;

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 lg:sticky lg:top-6">
      <h2 className="text-base font-bold text-text-primary mb-5">
        {t("totals.heading")}
      </h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-text-secondary">{t("totals.subtotal")}</span>
          <span className="font-medium text-text-primary">
            {subtotal.toLocaleString("vi-VN")}₫
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-text-secondary">{t("totals.shipping")}</span>
          <span className="font-medium text-text-primary">
            {shipping > 0 ? (
              `${shipping.toLocaleString("vi-VN")}₫`
            ) : (
              <span className="text-success">{t("totals.free")}</span>
            )}
          </span>
        </div>

        <hr className="border-border my-2" />

        <div className="flex justify-between text-base">
          <span className="font-bold text-text-primary">
            {t("totals.total")}
          </span>
          <span className="font-bold text-primary-500">
            {total.toLocaleString("vi-VN")}₫
          </span>
        </div>
      </div>

      {/* Checkout button */}
      <Link href={isEmpty ? "#" : "/thanh-toan"}>
        <button
          type="button"
          disabled={isEmpty}
          className={`
            w-full mt-6 h-11 rounded-lg text-sm font-semibold
            flex items-center justify-center gap-2 transition-all duration-200
            ${
              isEmpty
                ? "bg-secondary-200 text-text-disabled cursor-not-allowed"
                : "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 shadow-sm hover:shadow-md cursor-pointer"
            }
          `}
          onClick={(e) => {
            if (isEmpty) e.preventDefault();
          }}
        >
          {t("totals.checkoutBtn")}
          {!isEmpty && <ArrowRight size={16} />}
        </button>
      </Link>

      {/* Continue shopping */}
      <Link
        href="/phu-tung"
        className="mt-3 w-full h-10 rounded-lg text-sm font-medium border border-border
                   flex items-center justify-center gap-2
                   text-text-secondary hover:text-primary-500 hover:border-primary-300
                   transition-all duration-200"
      >
        <ShoppingBag size={14} />
        {t("totals.continueShopping")}
      </Link>
    </div>
  );
}
