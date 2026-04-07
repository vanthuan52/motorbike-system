"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import {
  CalendarCheck,
  Search,
  ClipboardList,
  Wrench,
  CheckCircle,
} from "lucide-react";
import { motion, useAnimation, useInView } from "framer-motion";
import { TRANSLATION_FILES } from "@/lib/i18n";

const steps = [
  {
    icon: <CalendarCheck className="w-8 h-8 text-primary-700" />,
    titleKey: "step1Title",
    descKey: "step1Desc",
  },
  {
    icon: <Search className="w-8 h-8 text-primary-700" />,
    titleKey: "step2Title",
    descKey: "step2Desc",
  },
  {
    icon: <ClipboardList className="w-8 h-8 text-primary-700" />,
    titleKey: "step3Title",
    descKey: "step3Desc",
  },
  {
    icon: <Wrench className="w-8 h-8 text-primary-700" />,
    titleKey: "step4Title",
    descKey: "step4Desc",
  },
  {
    icon: <CheckCircle className="w-8 h-8 text-primary-700" />,
    titleKey: "step5Title",
    descKey: "step5Desc",
  },
];

export default function ServiceProcess() {
  const t = useTranslations(
    `${TRANSLATION_FILES.SERVICE_PAGE}.serviceProcressSection`
  );

  return (
    <section className="bg-surface py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-text-primary mb-12">
          {t("title")}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <RotateCard
              key={index}
              icon={step.icon}
              title={t(step.titleKey)}
              description={t(step.descKey)}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function RotateCard({
  icon,
  title,
  description,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        rotate: 0,
        y: 0,
        transition: {
          duration: 0.6,
          delay: index * 0.2,
          ease: "easeOut",
        },
      });
    } else {
      controls.start({
        opacity: 0,
        rotate: index % 2 === 0 ? -10 : 10,
        y: 20,
      });
    }
  }, [inView, controls, index]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, rotate: index % 2 === 0 ? -10 : 10, y: 20 }}
      animate={controls}
      className="relative bg-surface-alt p-6 rounded-[var(--radius-xl)] shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-xl-hover)] transition"
    >
      <div className="flex items-center mb-4 space-x-3">
        <div className="flex-shrink-0">{icon}</div>
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      </div>
      <p className="text-sm text-text-secondary">{description}</p>
      <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary-700 text-white rounded-full flex items-center justify-center font-bold shadow">
        {index + 1}
      </div>
    </motion.div>
  );
}
