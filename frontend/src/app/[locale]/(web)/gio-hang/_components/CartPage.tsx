"use client";

import dynamic from "next/dynamic";
import { Suspense, useState } from "react";
import { motion } from "framer-motion";
import { Link, TRANSLATION_FILES } from "@/lib/i18n";
import { useTranslations } from "next-intl";

const CartTable = dynamic(() => import("./CartTable"), { ssr: false });
const CartTotals = dynamic(() => import("./CartTotals"), { ssr: false });

export default function CartPage() {
  const t = useTranslations(TRANSLATION_FILES.CART_PAGE);
  const [subtotal, setSubtotal] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="container mx-auto py-10"
    >
      <motion.ol
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap items-center text-base gap-2 mb-10 sm:text-sm sm:gap-1"
      >
        <li className="flex items-center gap-1 font-semibold text-primary-700">
          <span className="rounded-full border-2 border-primary-700 w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center bg-surface shadow-[var(--shadow-sm)] transition-colors text-base sm:text-sm">
            1
          </span>
          <Link href="/gio-hang" className="ml-2 sm:ml-1">
            <span className="hidden sm:block">{t("steps.step1.label")}</span>
            <span className="block sm:hidden">{t("steps.step1.short")}</span>
          </Link>
        </li>
        <span className="mx-2 text-text-muted sm:mx-1">&gt;</span>
        <li className="flex items-center gap-1 group">
          <span className="rounded-full border-2 border-border w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center bg-surface-alt transition-colors group-hover:border-primary-700 group-hover:text-primary-700 text-base sm:text-sm">
            2
          </span>
          <Link
            href={subtotal === 0 ? "#" : "/chi-tiet-thanh-toan"}
            className="ml-2 sm:ml-1 text-text-muted transition-colors group-hover:!text-primary-700"
          >
            <span className="hidden sm:block">{t("steps.step2.label")}</span>
            <span className="block sm:hidden">{t("steps.step2.short")}</span>
          </Link>
        </li>
        <span className="mx-2 text-text-muted sm:mx-1">&gt;</span>
        <li className="flex items-center gap-1 text-text-muted">
          <span className="rounded-full border-2 border-border w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center bg-surface-alt text-base sm:text-sm">
            3
          </span>
          <span className="ml-2 sm:ml-1">
            <span className="hidden sm:block">{t("steps.step3.label")}</span>
            <span className="block sm:hidden">{t("steps.step3.short")}</span>
          </span>
        </li>
      </motion.ol>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-col md:flex-row gap-10"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1"
        >
          <Suspense
            fallback={
              <div className="bg-surface rounded-[var(--radius-xl)] shadow-[var(--shadow-sm)] p-8 text-center text-text-muted">
                {t("loading.cart")}
              </div>
            }
          >
            <CartTable onTotalChange={setSubtotal} />
          </Suspense>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="w-full md:w-[350px]"
        >
          <Suspense
            fallback={
              <div className="bg-surface rounded-[var(--radius-xl)] shadow-[var(--shadow-sm)] p-8 text-center text-text-muted">
                {t("loading.totals")}
              </div>
            }
          >
            <CartTotals subtotal={subtotal} />
          </Suspense>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
