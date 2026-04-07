"use client";

import { JSX } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ShieldCheck, Wrench, Clock, Users } from "lucide-react";
import { TRANSLATION_FILES } from "@/lib/i18n";

interface Feature {
  icon: JSX.Element;
  titleKey: string;
  descKey: string;
}

export default function WhyChooseUsSection() {
  const t = useTranslations(`${TRANSLATION_FILES.HOME}.whyChooseUsSection`);

  const features: Feature[] = [
    {
      icon: <ShieldCheck className="w-10 h-10 text-primary-700" />,
      titleKey: "qualityTitle",
      descKey: "qualityDesc",
    },
    {
      icon: <Wrench className="w-10 h-10 text-success" />,
      titleKey: "expertTitle",
      descKey: "expertDesc",
    },
    {
      icon: <Clock className="w-10 h-10 text-warning" />,
      titleKey: "timelyTitle",
      descKey: "timelyDesc",
    },
    {
      icon: <Users className="w-10 h-10 text-primary-400" />,
      titleKey: "dedicatedTitle",
      descKey: "dedicatedDesc",
    },
  ];

  return (
    <section className="bg-surface-alt py-20">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-center text-text-primary mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {t("title")}
        </motion.h2>
        <motion.p
          className="text-center text-text-secondary mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        >
          {t("subtitle")}
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              className="bg-surface rounded-[var(--radius-xl)] shadow-[var(--shadow-md)] p-6 text-center hover:shadow-[var(--shadow-lg-hover)] transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{
                scale: 1.04,
                transition: { duration: 0.22, ease: "easeOut" },
              }}
              viewport={{ amount: 0.3 }}
              transition={{
                duration: 0.5,
                delay: 0.1 * idx,
                ease: "easeOut",
              }}
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {t(feature.titleKey)}
              </h3>
              <p className="text-sm text-text-secondary">{`${t(feature.descKey)}`}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
