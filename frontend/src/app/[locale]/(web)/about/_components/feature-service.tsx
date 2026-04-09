"use client";

import { motion } from "framer-motion";
import { Wrench, ShieldCheck, Car, Timer, BadgeCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { TRANSLATION_FILES } from "@/lib/i18n";
import SectionHeading from "@/components/ui/section-heading";

const FeaturedServices = () => {
  const t = useTranslations(`${TRANSLATION_FILES.ABOUT_PAGE}.featuredServices`);

  const services = [
    {
      icon: <Wrench className="w-8 h-8 text-white" />,
      title: t("services.0.title"),
      description: t("services.0.description"),
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-white" />,
      title: t("services.1.title"),
      description: t("services.1.description"),
    },
    {
      icon: <Car className="w-8 h-8 text-white" />,
      title: t("services.2.title"),
      description: t("services.2.description"),
    },
  ];

  return (
    <section className="bg-surface pt-10 pb-4">
      <div className="container">
        <SectionHeading title={t("heading")} className="mb-12" />

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              className="bg-primary-700 text-white rounded-[var(--radius-xl)] p-6 shadow-[var(--shadow-primary)] hover:shadow-[var(--shadow-primary-hover)] hover:-translate-y-px transition-all duration-200"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: 0.1 * idx,
                ease: "easeOut",
              }}
            >
              <div className="flex items-center justify-center mb-4">
                <div className="bg-primary-500 p-3 rounded-full">
                  {service.icon}
                </div>
              </div>
              <motion.h3
                className="text-xl font-semibold text-center mb-2"
                whileHover={{
                  scale: 1.08,
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {service.title}
              </motion.h3>
              <p className="text-center text-sm text-primary-100">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;
