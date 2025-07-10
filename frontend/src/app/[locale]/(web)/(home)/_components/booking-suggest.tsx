"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ROUTER_PATH } from "@/constant/router-path";
import { Link, TRANSLATION_FILES } from "@/lib/i18n";

export default function BookingSuggest() {
  const t = useTranslations(`${TRANSLATION_FILES.HOME}.bookingSuggest`);

  return (
    <section className="relative bg-blue-600 text-white py-20">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url('/images/cta-bg.jpg')` }}
      ></div>
      <div className="relative container mx-auto px-6 flex flex-col items-center text-center">
        <motion.h2
          className="text-2xl md:text-3xl font-bold mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {t("title")}
        </motion.h2>
        <motion.p
          className="text-lg md:text-xl mb-8 max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        >
          {t("description")}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <Link
            href={ROUTER_PATH.CARE_REGISTRATION}
            className="bg-white !text-blue-600 font-semibold px-6 py-3 rounded-full text-lg hover:bg-gray-100 transition shadow-md"
          >
            {t("button")}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
