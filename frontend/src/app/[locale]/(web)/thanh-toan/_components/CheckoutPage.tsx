"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import Breadcrumbs, { BreadcrumbItem } from "@/components/ui/Breadcrumbs";
import { TRANSLATION_FILES, useRouter } from "@/lib/i18n";
import { cartActions } from "@/features/cart/store";
import CheckoutForm, { type CheckoutFormValues } from "./CheckoutForm";
import OrderSummary from "./OrderSummary";

export default function CheckoutPage() {
  const t = useTranslations(TRANSLATION_FILES.CHECKOUT_PAGE);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t("breadcrumbs.home"), href: "/" },
    { label: t("breadcrumbs.cart"), href: "/gio-hang" },
    { label: t("breadcrumbs.checkout") },
  ];

  const handlePlaceOrder = async (values: CheckoutFormValues) => {
    setIsSubmitting(true);
    try {
      // TODO: Call API to place order
      console.log("Order placed:", values);

      // Clear cart & redirect to success page
      dispatch(cartActions.clearCart());
      router.push("/dat-hang-thanh-cong");
    } catch {
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-bg-soft min-h-screen">
      <div className="container pt-5">
        <Breadcrumbs
          items={breadcrumbs}
          className="pb-6"
          linkClassName="hover:!underline"
          activeClassName="text-text-primary font-semibold"
        />
      </div>

      <div className="container pb-16">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-8">
          {t("heading")}
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
          {/* Left: Form */}
          <div className="flex-1 min-w-0 space-y-6">
            <CheckoutForm
              onSubmit={handlePlaceOrder}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* Right: Order Summary (sticky) */}
          <div className="w-full lg:w-[400px] flex-shrink-0">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
