"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { TRANSLATION_FILES } from "@/lib/i18n";
import SectionHeading from "@/components/ui/section-heading";

const AboutHeroSection = () => {
  const t = useTranslations(`${TRANSLATION_FILES.ABOUT_PAGE}.aboutHeroSection`);

  return (
    <section className="bg-surface-alt py-2 md:py-4">
      <div className="container text-center">
        <div className="mb-16">
          <motion.div
            className="relative mb-8 w-full max-w-8xl mx-auto aspect-[3/1]"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Image
              src="/images/about/about-hero.jpg"
              alt="Trung Tâm Bảo Dưỡng"
              className="object-cover rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)]"
              fill
              priority
            />
          </motion.div>
          <SectionHeading 
            title={t("heading")} 
            subtitle={<span dangerouslySetInnerHTML={{ __html: t.raw("description") }} />}
            className="mb-8"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            className="bg-surface p-8 rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] hover:shadow-[var(--shadow-xl-hover)] transition-all duration-200"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <SectionHeading 
              title={t("missionTitle")} 
              subtitle={t("missionDesc")}
              align="left"
              className="mb-0"
              subtitleClassName="text-text-secondary text-lg" 
            />
          </motion.div>

          <motion.div
            className="bg-surface p-8 rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] hover:shadow-[var(--shadow-xl-hover)] transition-all duration-200"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <SectionHeading 
              title={t("visionTitle")} 
              subtitle={t("visionDesc")}
              align="left"
              className="mb-0"
              subtitleClassName="text-text-secondary text-lg" 
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutHeroSection;
