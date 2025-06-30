"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { TRANSLATION_FILES } from "@/lib/i18n";

export default function PageHeading() {
  const t = useTranslations(TRANSLATION_FILES.PART_TYPE_PAGE);

  const stats = [
    { label: t("pageHeading.stats.manualBike"), value: "120+" },
    { label: t("pageHeading.stats.scooter"), value: "80+" },
    { label: t("pageHeading.stats.clutchBike"), value: "60+" },
    { label: t("pageHeading.stats.genuine"), value: "40+" },
    { label: t("pageHeading.stats.custom"), value: "30+" },
  ];

  return (
    <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      <motion.div
        className="flex-1"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          {t("pageHeading.title")}
        </h2>
        <p className="text-white max-w-xl">{t("pageHeading.description")}</p>
      </motion.div>

      <motion.div
        className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4 lg:flex lg:flex-wrap lg:justify-end"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {stats.map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center text-white min-w-[100px]"
          >
            <span className="text-xl md:text-2xl font-bold">{item.value}</span>
            <span className="text-sm text-center">{item.label}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
