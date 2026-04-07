"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link, TRANSLATION_FILES } from "@/lib/i18n";
import { ROUTER_PATH } from "@/constant/router-path";

export default function HeroSection() {
  const t = useTranslations(`${TRANSLATION_FILES.HOME}.heroSection`);

  return (
    <section className="relative bg-surface overflow-hidden">
      <div className="container py-10 flex flex-col md:flex-row items-center gap-10">
        <motion.div
          className="w-full text-center md:text-left"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ amount: 0.2 }}
          transition={{ duration: 1.5, delay: 0.2 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary leading-tight mb-6">
            {t("title")}
          </h1>
          <p className="text-text-secondary text-lg md:text-xl mb-8">
            {t("description")}
          </p>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <Link href={ROUTER_PATH.CARE_REGISTRATION}>
              <motion.button
                className="bg-primary-700 hover:bg-primary-500 text-white font-semibold px-6 py-3 rounded-[var(--radius-md)] shadow-[var(--shadow-primary)] hover:shadow-[var(--shadow-primary-hover)] transition-all duration-200 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t("booking")}
              </motion.button>
            </Link>
            <Link href={ROUTER_PATH.SERVICES}>
              <motion.button
                className="border-2 border-primary-700 text-primary-700 hover:bg-primary-50 font-semibold px-6 py-3 rounded-[var(--radius-md)] transition-all duration-200 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t("services")}
              </motion.button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="w-full text-center md:text-left"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ amount: 0.2 }}
          transition={{ duration: 1.5, delay: 0.2 }}
        >
          <motion.img
            src="/images/home-page/hero-banner-bike.jpg"
            alt="Hero image"
            className="w-full h-full mx-auto md:mx-0 rounded-[var(--radius-lg)]"
            whileHover={{ scale: 1.02 }}
          />
        </motion.div>
      </div>

      {/* Gradient background */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary-50 to-transparent -z-10" />
    </section>
  );
}
