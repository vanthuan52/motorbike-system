"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

import { RootState } from "@/store";
import { fetchProductsByIds } from "../../gio-hang/_components/cart-api";
import { Link, TRANSLATION_FILES } from "@/lib/i18n";
import { Product } from "@/types/users/products/product";
import { IMG_PLACEHOLDER } from "@/constant/application";

export default function OrderSummary() {
  const t = useTranslations(TRANSLATION_FILES.CHECKOUT_PAGE);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchProductsByIds(cartItems.map((i) => String(i.productId))).then(
      (data) => {
        setProducts(data);
        setLoading(false);
      }
    );
  }, [cartItems]);

  const subtotal = products.reduce((sum, p) => {
    const item = cartItems.find((i) => i.productId === p.id);
    return sum + (item?.quantity || 0) * p.price;
  }, 0);
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  return (
    <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 lg:sticky lg:top-6">
      <h2 className="text-lg font-bold text-text-primary mb-5">
        {t("summary.title")}
      </h2>

      {/* Product list */}
      <div className="space-y-4 max-h-[320px] overflow-y-auto mb-5">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-14 h-14 bg-secondary-100 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-3.5 bg-secondary-100 rounded w-3/4" />
                  <div className="h-3 bg-secondary-50 rounded w-1/2" />
                </div>
              </div>
            ))
          : products.map((p) => {
              const item = cartItems.find((i) => i.productId === p.id);
              if (!item) return null;

              return (
                <div key={p.id} className="flex gap-3 items-center">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-bg-soft flex-shrink-0">
                    <Image
                      src={p.image[0] || IMG_PLACEHOLDER}
                      alt={p.name}
                      fill
                      className="object-contain p-1"
                      sizes="56px"
                    />
                    {/* Quantity badge */}
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary line-clamp-1">
                      {p.name}
                    </p>
                    <p className="text-xs text-text-muted">
                      {p.price.toLocaleString("vi-VN")}₫ × {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-text-primary whitespace-nowrap">
                    {(p.price * item.quantity).toLocaleString("vi-VN")}₫
                  </span>
                </div>
              );
            })}
      </div>

      {/* Totals */}
      <hr className="border-border mb-4" />
      <div className="space-y-2.5 text-sm">
        <div className="flex justify-between">
          <span className="text-text-secondary">{t("summary.subtotal")}</span>
          <span className="font-medium text-text-primary">
            {subtotal.toLocaleString("vi-VN")}₫
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-secondary">{t("summary.shipping")}</span>
          <span className="font-medium text-success">
            {t("summary.shippingValue")}
          </span>
        </div>

        <hr className="border-border" />

        <div className="flex justify-between text-base pt-1">
          <span className="font-bold text-text-primary">
            {t("summary.total")}
          </span>
          <span className="font-bold text-primary-500">
            {total.toLocaleString("vi-VN")}₫
          </span>
        </div>
      </div>

      {/* Place order — desktop */}
      <button
        type="submit"
        form="" // Will be connected via form attribute or wrapping
        className="hidden lg:flex w-full mt-6 h-11 rounded-lg bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 active:bg-primary-700 transition-colors items-center justify-center cursor-pointer shadow-sm hover:shadow-md"
        onClick={() => {
          // Trigger form submit
          const form = document.querySelector("form");
          if (form) form.requestSubmit();
        }}
      >
        {t("summary.placeOrder")}
      </button>

      {/* Back to cart */}
      <Link
        href="/gio-hang"
        className="mt-3 w-full h-10 rounded-lg text-sm font-medium border border-border
                   flex items-center justify-center gap-2
                   text-text-secondary hover:text-primary-500 hover:border-primary-300
                   transition-all duration-200"
      >
        <ArrowLeft size={14} />
        {t("summary.backToCart")}
      </Link>
    </div>
  );
}
