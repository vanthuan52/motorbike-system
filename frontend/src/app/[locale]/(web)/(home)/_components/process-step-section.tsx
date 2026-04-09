"use client";

import {
  CalendarCheck,
  SearchCheck,
  BadgeDollarSign,
  CheckCircle,
} from "lucide-react";
import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { TRANSLATION_FILES } from "@/lib/i18n";
import SectionHeading from "@/components/ui/section-heading";

interface Step {
  key: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  {
    key: "step1",
    icon: <CalendarCheck className="w-8 h-8 text-primary-700" />,
  },
  {
    key: "step2",
    icon: <SearchCheck className="w-8 h-8 text-success" />,
  },
  {
    key: "step3",
    icon: <BadgeDollarSign className="w-8 h-8 text-warning" />,
  },
  {
    key: "step4",
    icon: <CheckCircle className="w-8 h-8 text-primary-400" />,
  },
];

export default function ProcessStepsSection() {
  const t = useTranslations(`${TRANSLATION_FILES.HOME}.processStepSection`);

  return (
    <section className="bg-surface py-20" id="process-steps">
      <div className="container mx-auto px-4">
        {/* Header */}
        <SectionHeading title={t("title")} className="mb-16" />

        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-1 bg-primary-100 hidden sm:block" />
          <div className="space-y-12">
            {steps.map((step, idx) => (
              <motion.div
                key={step.key}
                className="relative flex flex-col sm:flex-row sm:items-start sm:gap-6 group"
                initial={{ opacity: 0, y: -30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: 0.2 + idx * 0.18,
                  ease: "easeOut",
                }}
              >
                <div className="hidden sm:flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-primary-700 text-white flex items-center justify-center z-10 ml-1 text-xs font-bold">
                    {idx + 1}
                  </div>
                  {idx !== steps.length - 1 && (
                    <div className="w-px h-full bg-primary-200 mt-2" />
                  )}
                </div>

                <div className="bg-surface-alt p-6 rounded-[var(--radius-xl)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md-hover)] transition-all duration-200 w-full">
                  <div className="flex items-center gap-4 mb-3">
                    <div>{step.icon}</div>
                    <h3 className="text-lg font-semibold text-text-primary">
                      {t(`${step.key}.title`)}
                    </h3>
                  </div>
                  <p className="text-text-secondary text-sm">
                    {t(`${step.key}.description`)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
