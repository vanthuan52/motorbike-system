"use client";

import { JSX } from "react";
import { motion } from "framer-motion";
import { Wrench, Percent } from "lucide-react";
import { useTranslations } from "next-intl";
import { TRANSLATION_FILES } from "@/lib/i18n";
import SectionHeading from "@/components/ui/section-heading";

interface Combo {
  icon: JSX.Element;
  key: string;
}

const combos: Combo[] = [
  {
    key: "full",
    icon: <Wrench className="w-8 h-8 text-primary-700" />,
  },
  {
    key: "oil",
    icon: <Wrench className="w-8 h-8 text-success" />,
  },
  {
    key: "newCustomer",
    icon: <Percent className="w-8 h-8 text-accent" />,
  },
];

export default function ServiceComboSection() {
  const t = useTranslations(`${TRANSLATION_FILES.HOME}.serviceComboSection`);

  return (
    <section className="bg-surface-alt py-20" id="service-combo">
      <div className="container">
        <SectionHeading title={t("title")} className="mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {combos.map((combo, idx) => (
            <motion.div
              key={combo.key}
              className="group p-6 rounded-[var(--radius-2xl)] shadow-[var(--shadow-md)] transition-all duration-300 hover:shadow-[var(--shadow-xl-hover)] bg-surface"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{
                scale: 1.04,
                transition: { duration: 0.22, ease: "easeOut" },
              }}
              viewport={{ amount: 0.3 }}
              transition={{
                duration: 0.5,
                delay: 0.12 * idx,
                ease: "easeOut",
              }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div>{combo.icon}</div>
                <h3 className="text-xl font-semibold text-text-primary">
                  {t(`${combo.key}.title`)}
                </h3>
              </div>
              <p className="text-text-secondary text-sm mb-4">
                {t(`${combo.key}.description`)}
              </p>
              <div className="text-primary-700 text-lg font-bold">
                {t(`${combo.key}.price`)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
