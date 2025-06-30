"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { APP_INFO } from "@/constant/application";
import { TRANSLATION_FILES } from "@/lib/i18n";

const featureKeys = ["quality", "team", "booking"] as const;

export default function QuickIntroSection() {
  const t = useTranslations(`${TRANSLATION_FILES.HOME}.quickIntroSection`);

  return (
    <section className="bg-gray-50 py-16">
      <div className="container text-center">
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-gray-900 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {t("title", { name: APP_INFO.NAME })}
        </motion.h2>
        <motion.p
          className="text-gray-700 text-lg md:text-xl leading-relaxed mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          dangerouslySetInnerHTML={{
            __html: t.raw("description"),
          }}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
          {featureKeys.map((key, idx) => (
            <Feature
              key={key}
              title={t(`${key}.title`)}
              description={t(`${key}.description`)}
              delay={0.3 + idx * 0.15}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Feature({
  title,
  description,
  delay = 0,
}: {
  title: string;
  description: string;
  delay?: number;
}) {
  return (
    <motion.div
      className="p-6 bg-white shadow-md rounded-lg text-left  transition"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 8px 32px rgba(0,0,0,0.16)",
        transition: { duration: 0.22, ease: "easeOut" },
      }}
      viewport={{ amount: 0.2 }}
      transition={{
        opacity: { duration: 0.5, delay, ease: "easeOut" },
        y: { duration: 0.5, delay, ease: "easeOut" },
      }}
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}
