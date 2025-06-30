"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { FaFlagCheckered, FaTools, FaUsers, FaAward } from "react-icons/fa";
import { TRANSLATION_FILES } from "@/lib/i18n";

const HistorySection = () => {
  const t = useTranslations(`${TRANSLATION_FILES.ABOUT_PAGE}.historySection`);

  const milestones = [0, 1, 2, 3].map((i) => ({
    year: t(`milestones.${i}.year`),
    description: t(`milestones.${i}.description`),
  }));

  const icons = [FaFlagCheckered, FaTools, FaUsers, FaAward];

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container">
        <motion.h2
          className="text-3xl font-bold text-center text-gray-900 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {t("heading")}
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
          <motion.div
            className="relative w-full h-72"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Image
              src="/images/about/founding-story.jpg"
              alt={t("founding.title")}
              className="rounded-xl shadow-lg object-cover"
              fill
              priority
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              {t("founding.title")}
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t("founding.content")}
            </p>
          </motion.div>
        </div>

        <motion.div
          className="bg-gray-50 p-8 rounded-xl shadow-inner"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h3 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
            {t("milestoneTitle")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {milestones.map((item, idx) => {
              const Icon = icons[idx];
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ amount: 0.2 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.1 * idx,
                    ease: "easeOut",
                  }}
                >
                  <div className="text-indigo-600 text-4xl mb-4 flex justify-center">
                    <Icon />
                  </div>
                  <h4 className="text-xl font-bold text-gray-800">
                    {item.year}
                  </h4>
                  <p className="text-gray-600 mt-2">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HistorySection;
