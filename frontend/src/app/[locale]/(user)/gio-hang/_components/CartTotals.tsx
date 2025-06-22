"use client";

import { useTranslations } from "next-intl";
import clsx from "clsx";
import { CustomLink } from "@/components/CustomerLink/CustomLink";

export default function CartTotals({ subtotal }: { subtotal: number }) {
  const t = useTranslations("cartPage");
  const shipping = subtotal > 0 ? 45000 : 0;
  const total = subtotal + shipping;

  return (
    <div className="bg-white rounded-xl shadow p-6 min-w-[320px]">
      <h2 className="font-bold text-lg mb-4">{t("totals.heading")}</h2>

      <div className="flex justify-between py-2 border-b">
        <span>{t("totals.subtotal")}</span>
        <span className="font-semibold">{subtotal.toLocaleString()} đ</span>
      </div>

      <div className="flex justify-between py-2 border-b">
        <span>{t("totals.shipping")}</span>
        <span>
          {shipping > 0 ? (
            <>
              <span className="font-semibold">
                {shipping.toLocaleString()} đ
              </span>
              <span className="ml-1 text-gray-500">
                ({t("totals.shippingNote")})
              </span>
            </>
          ) : (
            <span>{t("totals.free")}</span>
          )}
        </span>
      </div>

      <div className="flex justify-between py-2 mt-2 text-lg font-bold text-orange-600">
        <span>{t("totals.total")}</span>
        <span>{total.toLocaleString()} đ</span>
      </div>

      <CustomLink href={total === 0 ? "#" : "/chi-tiet-thanh-toan"}>
        <button
          className={clsx(
            "w-full mt-4 py-2 rounded bg-orange-500 text-white font-semibold hover:bg-orange-600 transition",
            total === 0 && "opacity-60 cursor-not-allowed"
          )}
          disabled={total === 0}
          tabIndex={total === 0 ? -1 : 0}
          onClick={(e) => {
            if (total === 0) e.preventDefault();
          }}
        >
          {t("totals.checkoutBtn")}
        </button>
      </CustomLink>
    </div>
  );
}
