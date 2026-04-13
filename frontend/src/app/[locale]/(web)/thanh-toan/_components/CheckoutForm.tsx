"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Banknote, Wallet } from "lucide-react";

import { TRANSLATION_FILES } from "@/lib/i18n";

export interface CheckoutFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  note: string;
  paymentMethod: "cod" | "momo";
}

interface Props {
  onSubmit: (values: CheckoutFormValues) => void;
  isSubmitting: boolean;
}

export default function CheckoutForm({ onSubmit, isSubmitting }: Props) {
  const t = useTranslations(TRANSLATION_FILES.CHECKOUT_PAGE);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "momo">("cod");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values: CheckoutFormValues = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      zip: formData.get("zip") as string,
      note: formData.get("note") as string,
      paymentMethod,
    };

    // Validate
    const newErrors: Record<string, string> = {};
    const requiredFields = ["firstName", "lastName", "email", "phone", "address", "city"] as const;
    requiredFields.forEach((field) => {
      if (!values[field]?.trim()) {
        newErrors[field] = t("form.required");
      }
    });
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      newErrors.email = t("form.emailInvalid");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit(values);
  };

  const inputClass =
    "w-full h-11 px-4 rounded-lg border border-border bg-surface text-sm text-text-primary placeholder:text-text-muted focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 outline-none transition-all";

  const labelClass = "block text-sm font-medium text-text-primary mb-1.5";

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* ── Shipping info ── */}
      <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8">
        <h2 className="text-lg font-bold text-text-primary mb-6">
          {t("form.title")}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
          {/* First name */}
          <div>
            <label htmlFor="firstName" className={labelClass}>
              {t("form.firstName")} <span className="text-error">*</span>
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder={t("form.firstName")}
              className={inputClass}
            />
            {errors.firstName && (
              <p className="text-xs text-error mt-1">{errors.firstName}</p>
            )}
          </div>

          {/* Last name */}
          <div>
            <label htmlFor="lastName" className={labelClass}>
              {t("form.lastName")} <span className="text-error">*</span>
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder={t("form.lastName")}
              className={inputClass}
            />
            {errors.lastName && (
              <p className="text-xs text-error mt-1">{errors.lastName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className={labelClass}>
              {t("form.email")} <span className="text-error">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder={t("form.email")}
              className={inputClass}
            />
            {errors.email && (
              <p className="text-xs text-error mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className={labelClass}>
              {t("form.phone")} <span className="text-error">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder={t("form.phone")}
              className={inputClass}
            />
            {errors.phone && (
              <p className="text-xs text-error mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Address — full width */}
          <div className="sm:col-span-2">
            <label htmlFor="address" className={labelClass}>
              {t("form.address")} <span className="text-error">*</span>
            </label>
            <input
              id="address"
              name="address"
              type="text"
              placeholder={t("form.address")}
              className={inputClass}
            />
            {errors.address && (
              <p className="text-xs text-error mt-1">{errors.address}</p>
            )}
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className={labelClass}>
              {t("form.city")} <span className="text-error">*</span>
            </label>
            <input
              id="city"
              name="city"
              type="text"
              placeholder={t("form.city")}
              className={inputClass}
            />
            {errors.city && (
              <p className="text-xs text-error mt-1">{errors.city}</p>
            )}
          </div>

          {/* Zip */}
          <div>
            <label htmlFor="zip" className={labelClass}>
              {t("form.zip")}
            </label>
            <input
              id="zip"
              name="zip"
              type="text"
              placeholder={t("form.zip")}
              className={inputClass}
            />
          </div>

          {/* Note — full width */}
          <div className="sm:col-span-2">
            <label htmlFor="note" className={labelClass}>
              {t("form.note")}
            </label>
            <textarea
              id="note"
              name="note"
              rows={3}
              placeholder={t("form.notePlaceholder")}
              className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-sm text-text-primary placeholder:text-text-muted focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 outline-none transition-all resize-none"
            />
          </div>
        </div>
      </div>

      {/* ── Payment method ── */}
      <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 mt-6">
        <h2 className="text-lg font-bold text-text-primary mb-5">
          {t("payment.title")}
        </h2>

        <div className="space-y-3">
          {/* COD */}
          <label
            className={`
              flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
              ${
                paymentMethod === "cod"
                  ? "border-primary-500 bg-primary-50"
                  : "border-border hover:border-primary-300"
              }
            `}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
              className="sr-only"
            />
            <div
              className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                ${paymentMethod === "cod" ? "border-primary-500" : "border-border"}
              `}
            >
              {paymentMethod === "cod" && (
                <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />
              )}
            </div>
            <div className="w-10 h-10 rounded-lg bg-success-bg flex items-center justify-center flex-shrink-0">
              <Banknote size={20} className="text-success" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-primary">
                {t("payment.cod")}
              </p>
              <p className="text-xs text-text-muted">{t("payment.codDesc")}</p>
            </div>
          </label>

          {/* MoMo — disabled */}
          <div
            className="flex items-center gap-4 p-4 rounded-xl border-2 border-border opacity-50 cursor-not-allowed relative"
          >
            <div className="w-5 h-5 rounded-full border-2 border-border flex-shrink-0" />
            <div className="w-10 h-10 rounded-lg bg-[#fff0f6] flex items-center justify-center flex-shrink-0">
              <Wallet size={20} className="text-[#ae2070]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-primary">
                {t("payment.momo")}
              </p>
              <p className="text-xs text-text-muted">{t("payment.momoDesc")}</p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted bg-bg-soft px-2 py-0.5 rounded-md">
              {t("payment.momoDisabled")}
            </span>
          </div>
        </div>
      </div>

      {/* Submit — mobile only (desktop uses OrderSummary button) */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="lg:hidden w-full mt-6 h-12 rounded-lg bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50"
      >
        {t("summary.placeOrder")}
      </button>
    </form>
  );
}
