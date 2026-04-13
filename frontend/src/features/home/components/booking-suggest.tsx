"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ROUTER_PATH } from "@/constant/router-path";
import { Link, TRANSLATION_FILES } from "@/lib/i18n";
import SectionHeading from "@/components/ui/section-heading";

export default function BookingSuggest() {
  const t = useTranslations(`${TRANSLATION_FILES.HOME}.bookingSuggest`);

  return (
    <section
      className="relative bg-primary-700 text-white py-20"
      id="booking-suggest"
    >
      <div className="absolute inset-0 bg-cover bg-center opacity-20"></div>
      <div className="relative container flex flex-col items-center text-center">
        <SectionHeading
          title={t("title")}
          subtitle={t("description")}
          titleClassName="text-white"
          subtitleClassName="text-lg md:text-xl text-primary-100"
          className="mb-8"
          hideUnderline={true}
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <Link
            href={ROUTER_PATH.CARE_REGISTRATION}
            className="bg-surface !text-primary-700 font-semibold px-6 py-3 rounded-full text-lg hover:bg-primary-50 transition-all duration-200 shadow-[var(--shadow-md)]"
          >
            {t("button")}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
