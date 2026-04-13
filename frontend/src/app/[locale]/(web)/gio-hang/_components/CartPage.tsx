"use client";

import dynamic from "next/dynamic";
import { Suspense, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslations } from "next-intl";

import { RootState } from "@/store";
import Breadcrumbs, { BreadcrumbItem } from "@/components/ui/Breadcrumbs";
import { TRANSLATION_FILES } from "@/lib/i18n";

const CartTable = dynamic(() => import("./CartTable"), { ssr: false });
const CartTotals = dynamic(() => import("./CartTotals"), { ssr: false });

export default function CartPage() {
  const t = useTranslations(TRANSLATION_FILES.CART_PAGE);
  const [subtotal, setSubtotal] = useState(0);
  const totalItems = useSelector((state: RootState) => state.cart.totalItems);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t("breadcrumbs.home"), href: "/" },
    { label: t("breadcrumbs.cart") },
  ];

  return (
    <div className="bg-bg-soft min-h-screen">
      {/* Breadcrumb */}
      <div className="container pt-5">
        <Breadcrumbs
          items={breadcrumbs}
          className="pb-6"
          linkClassName="hover:!underline"
          activeClassName="text-text-primary font-semibold"
        />
      </div>

      {/* Heading */}
      <div className="container pb-6">
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
            {t("heading")}
          </h1>
          {totalItems > 0 && (
            <span className="text-sm text-text-muted font-medium">
              ({t("itemCount", { count: totalItems })})
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <section className="pb-16">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
            {/* Cart items — left */}
            <div className="flex-1 min-w-0">
              <Suspense
                fallback={
                  <div className="py-12 text-center text-text-muted text-sm">
                    {t("heading")}...
                  </div>
                }
              >
                <CartTable onTotalChange={setSubtotal} />
              </Suspense>
            </div>

            {/* Order summary — right (sticky) */}
            <div className="w-full lg:w-[380px] flex-shrink-0">
              <Suspense
                fallback={
                  <div className="rounded-2xl border border-border p-6 animate-pulse">
                    <div className="h-5 bg-secondary-200 rounded w-1/2 mb-4" />
                    <div className="space-y-3">
                      <div className="h-4 bg-secondary-100 rounded" />
                      <div className="h-4 bg-secondary-100 rounded" />
                      <div className="h-4 bg-secondary-200 rounded" />
                    </div>
                  </div>
                }
              >
                <CartTotals subtotal={subtotal} />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
