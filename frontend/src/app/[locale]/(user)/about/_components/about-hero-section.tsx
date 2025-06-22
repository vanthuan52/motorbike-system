"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
const AboutUsSection = () => {
  const t = useTranslations("aboutUsSectionAboutpage");

  return (
    <section className="bg-gray-50 py-2 md:py-4">
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
              className="object-cover rounded-xl shadow-lg"
              fill
              priority
            />
          </motion.div>
          <motion.h2
            className="text-2xl md:text-3xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {t("heading")}
          </motion.h2>
          <motion.p
            className="text-lg text-gray-700 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          >
            <span
              dangerouslySetInnerHTML={{
                __html: t.raw("description"),
              }}
            />
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              {t("missionTitle")}
            </h3>
            <p className="text-gray-600 text-lg">{t("missionDesc")}</p>
          </motion.div>

          <motion.div
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              {t("visionTitle")}
            </h3>
            <p className="text-gray-600 text-lg">{t("visionDesc")}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
