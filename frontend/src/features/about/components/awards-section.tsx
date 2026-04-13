"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { TRANSLATION_FILES } from "@/lib/i18n";
import SectionHeading from "@/components/ui/section-heading";

const AwardsSection = () => {
  const t = useTranslations(`${TRANSLATION_FILES.ABOUT_PAGE}.awardsSection`);

  const awards = [0, 1, 2].map((index) => ({
    title: t(`awards.${index}.title`),
    description: t(`awards.${index}.description`),
    image: `/images/about/award-${index + 1}.jpg`,
  }));

  return (
    <section className="bg-surface-alt py-20 md:py-28">
      <div className="container">
        <SectionHeading title={t("heading")} className="mb-12" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {awards.map((item, index) => (
            <motion.div
              key={index}
              className="bg-surface shadow-[var(--shadow-md)] rounded-[var(--radius-2xl)] overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-lg-hover)]"
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: 0.1 * index,
                ease: "easeOut",
              }}
            >
              <div className="relative w-full h-48">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={index === 0}
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-text-secondary">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AwardsSection;
