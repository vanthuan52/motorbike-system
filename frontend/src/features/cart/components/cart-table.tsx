"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Minus, Plus, Trash2 } from "lucide-react";

import { RootState } from "@/store";
import { cartActions } from "@/features/cart/store";
import { fetchProductsByIds } from "./cart-api";
import { Link, TRANSLATION_FILES } from "@/lib/i18n";
import { Product } from "@/types/users/products/product";
import { IMG_PLACEHOLDER } from "@/constant/application";

export default function CartTable({
  onTotalChange,
}: {
  onTotalChange: (total: number) => void;
}) {
  const t = useTranslations(TRANSLATION_FILES.CART_PAGE);
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cartItems.length === 0) {
      setProducts([]);
      onTotalChange(0);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchProductsByIds(cartItems.map((i) => String(i.productId))).then(
      (data) => {
        setProducts(data);
        setLoading(false);
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems.length]);

  useEffect(() => {
    const total = products.reduce((sum, p) => {
      const item = cartItems.find((i) => i.productId === p.id);
      return sum + (item?.quantity || 0) * p.price;
    }, 0);
    onTotalChange(total);
  }, [cartItems, products, onTotalChange]);

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 rounded-xl bg-bg-soft animate-pulse"
          >
            <div className="w-20 h-20 rounded-lg bg-secondary-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-secondary-200 rounded w-3/4" />
              <div className="h-3 bg-secondary-100 rounded w-1/2" />
            </div>
            <div className="w-20 h-4 bg-secondary-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  /* ── Empty state ── */
  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-24 h-24 rounded-full bg-bg-soft flex items-center justify-center mb-6">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-text-muted"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          {t("empty.title")}
        </h3>
        <p className="text-sm text-text-muted mb-6 max-w-xs">
          {t("empty.description")}
        </p>
        <Link
          href="/phu-tung"
          className="inline-flex items-center px-6 py-2.5 rounded-lg bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-colors"
        >
          {t("empty.cta")}
        </Link>
      </div>
    );
  }

  /* ── Cart items ── */
  return (
    <div className="space-y-0">
      {/* Header row — desktop */}
      <div className="hidden sm:grid grid-cols-[1fr_120px_140px_100px_40px] gap-4 px-4 pb-3 text-xs font-semibold text-text-muted uppercase tracking-wide border-b border-border">
        <span>{t("table.product")}</span>
        <span className="text-center">{t("table.price")}</span>
        <span className="text-center">{t("table.quantity")}</span>
        <span className="text-right">{t("table.total")}</span>
        <span />
      </div>

      {/* Items */}
      {products.map((p) => {
        const item = cartItems.find((i) => i.productId === p.id);
        if (!item) return null;
        const lineTotal = p.price * item.quantity;

        return (
          <div
            key={`${p.id}-${item.color}`}
            className="grid grid-cols-1 sm:grid-cols-[1fr_120px_140px_100px_40px] gap-4 items-center px-4 py-5 border-b border-border last:border-b-0 hover:bg-bg-soft/50 transition-colors"
          >
            {/* Product info */}
            <div className="flex items-center gap-4">
              <Link
                href={`/phu-tung/${p.slug}`}
                className="relative w-20 h-20 rounded-xl overflow-hidden bg-bg-soft flex-shrink-0"
              >
                <Image
                  src={p.image[0] || IMG_PLACEHOLDER}
                  alt={p.name}
                  fill
                  className="object-contain p-1"
                  sizes="80px"
                />
              </Link>
              <div className="min-w-0">
                <Link
                  href={`/phu-tung/${p.slug}`}
                  className="text-sm font-semibold text-text-primary hover:text-primary-500 transition-colors line-clamp-2"
                >
                  {p.name}
                </Link>
                {item.color && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full ring-1 ring-border"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-text-muted capitalize">
                      {item.color}
                    </span>
                  </div>
                )}
                {/* Mobile price */}
                <span className="sm:hidden text-sm font-semibold text-text-primary mt-1 block">
                  {p.price.toLocaleString("vi-VN")}₫
                </span>
              </div>
            </div>

            {/* Price — desktop */}
            <div className="hidden sm:block text-center text-sm font-medium text-text-primary">
              {p.price.toLocaleString("vi-VN")}₫
            </div>

            {/* Quantity */}
            <div className="flex items-center justify-center">
              <div className="inline-flex items-center border border-border rounded-lg overflow-hidden">
                <button
                  type="button"
                  className="w-9 h-9 flex items-center justify-center text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  onClick={() =>
                    dispatch(
                      cartActions.decrementItem({
                        productId: p.id,
                        color: item.color,
                      }),
                    )
                  }
                  disabled={item.quantity <= 1}
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-sm font-semibold text-text-primary select-none">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  className="w-9 h-9 flex items-center justify-center text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors"
                  onClick={() =>
                    dispatch(
                      cartActions.incrementItem({
                        productId: p.id,
                        color: item.color,
                      }),
                    )
                  }
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Line total */}
            <div className="hidden sm:block text-right text-sm font-bold text-text-primary">
              {lineTotal.toLocaleString("vi-VN")}₫
            </div>

            {/* Remove */}
            <div className="flex justify-end">
              <button
                type="button"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-text-muted hover:text-error hover:bg-error/5 transition-all cursor-pointer"
                onClick={() =>
                  dispatch(
                    cartActions.removeFromCart({
                      productId: p.id,
                      color: item.color,
                    }),
                  )
                }
                title={t("table.remove")}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        );
      })}

      {/* Clear all */}
      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={() => dispatch(cartActions.clearCart())}
          className="text-xs font-medium text-text-muted hover:text-error transition-colors cursor-pointer"
        >
          {t("table.clearAll")}
        </button>
      </div>
    </div>
  );
}
