"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { FaBuilding, FaUsers } from "react-icons/fa";
import {
  COMPANY_IMAGE,
  COMPANY_IMAGE_ALT,
  COMPANY_INDUSTRY,
  COMPANY_NAME,
  COMPANY_SIZE,
  COMPANY_SOCIALS,
  COMPANY_WHO_DESC,
  COMPANY_WHO_TITLE,
  COMPANY_WORK_DESC,
  COMPANY_WORK_TITLE,
} from "../constants/career";
import { TRANSLATION_FILES } from "@/lib/i18n";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function CompanyDescription() {
  const t = useTranslations(TRANSLATION_FILES.HIRING);
  return (
    <motion.div
      className="lg:col-span-2 space-y-6"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      transition={{ staggerChildren: 0.2 }}
    >
      <motion.div variants={fadeInUp}>
        <div className="text-text-muted text-xl mb-1">
          {t("companyDescription.title")}
        </div>
        <div className="text-3xl font-bold mb-4">{t("companyInfo.name")}</div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-2 bg-secondary-100 px-3 py-1 rounded-full text-sm text-text-primary">
            <FaBuilding className="text-text-muted" />
            {t("companyInfo.industry")}
          </div>
          <div className="flex items-center gap-2 bg-secondary-100 px-3 py-1 rounded-full text-sm text-text-primary">
            <FaUsers className="text-text-muted" />
            {t("companyInfo.size")}
          </div>
          <div className="flex gap-3 text-text-muted text-xl">
            {COMPANY_SOCIALS.map(({ icon: Icon, href }, idx) => (
              <a
                key={idx}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon className="hover:text-orange-500 cursor-pointer" />
              </a>
            ))}
          </div>
        </div>

        <h2 className="text-xl font-bold mb-2">{t("companyInfo.workTitle")}</h2>
        <p className="text-text-secondary">{t("companyInfo.workDesc")}</p>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <Image
          src={COMPANY_IMAGE}
          alt={COMPANY_IMAGE_ALT}
          width={800}
          height={450}
          className="rounded-lg w-full h-auto object-cover"
        />
      </motion.div>

      <motion.div variants={fadeInUp}>
        <h3 className="text-xl font-semibold mb-2">
          {t("companyInfo.whoTitle")}
        </h3>
        <p className="text-gray-700">{t("companyInfo.whoDesc")}</p>
      </motion.div>
    </motion.div>
  );
}
