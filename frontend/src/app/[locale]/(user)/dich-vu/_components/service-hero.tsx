"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function ServiceHero() {
  const t = useTranslations("heroServicepage");

  return (
    <section className="relative bg-gray-900 text-white overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <Image
          src="/images/services/service-hero.png"
          alt={t("imageAlt")}
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
      </motion.div>

      <div className="relative z-10 container py-24 flex flex-col justify-center items-start text-left space-y-6">
        <motion.h1
          className="text-2xl md:text-3xl font-bold"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {t("title")}
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl leading-relaxed text-gray-200"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        >
          {t("subtitle")}
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-4"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
        >
          <motion.a
            href="#pricing"
            whileHover={{ scale: 1.05 }}
            className="bg-red-400 text-black px-6 py-3 rounded-full font-semibold transition"
          >
            {t("ctaPrice")}
          </motion.a>

          <motion.a
            href="/dat-lich"
            whileHover={{ scale: 1.05 }}
            className="border border-white text-white px-6 py-3 rounded-full transition hover:text-black"
          >
            {t("ctaBooking")}
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
