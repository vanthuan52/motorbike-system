"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { TRANSLATION_FILES } from "@/lib/i18n";

const servicesKeys = ["repair", "oilChange", "wash", "replacement"] as const;

export default function MainServicesSection() {
  const t = useTranslations(`${TRANSLATION_FILES.HOME}.serviceSection`);

  return (
    <section className="bg-surface py-20">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-center text-text-primary mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.5 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {t("title")}
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {servicesKeys.map((key, idx) => (
            <motion.div
              key={key}
              className="bg-surface border border-border rounded-[var(--radius-xl)] shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg-hover)] transition-all duration-300"
              whileHover={{
                scale: 1.04,
                transition: { duration: 0.22, ease: "easeOut" },
              }}
            >
              <motion.div
                className="relative h-60 w-full rounded-t-[var(--radius-xl)] overflow-hidden"
                initial={{ scale: 0.85, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ amount: 0.3 }}
                transition={{
                  duration: 0.5,
                  delay: 0.1 * idx,
                  ease: "easeOut",
                }}
              >
                <Image
                  src={t(`${key}.image`)}
                  alt={t(`${key}.title`)}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 25vw"
                  unoptimized
                />
              </motion.div>

              <div className="p-5 text-center">
                <motion.h3
                  className="text-lg font-semibold text-text-primary mb-2"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ amount: 0.3 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.15 + 0.1 * idx,
                    ease: "easeOut",
                  }}
                >
                  {t(`${key}.title`)}
                </motion.h3>
                <motion.p
                  className="text-sm text-text-secondary"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ amount: 0.3 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.18 + 0.1 * idx,
                    ease: "easeOut",
                  }}
                >
                  {t(`${key}.description`)}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-center py-5 mt-5">
          <button className="border-2 border-primary-700 text-primary-700 hover:bg-primary-50 font-semibold px-6 py-3 rounded-[var(--radius-md)] transition-all duration-200 cursor-pointer">
            {t("viewAll")}
          </button>
        </div>
      </div>
    </section>
  );
}
