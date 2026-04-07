"use client";

import { Space } from "antd";
import { useTranslations } from "next-intl";
import { Link, TRANSLATION_FILES } from "@/lib/i18n";

export const ContactCTA = () => {
  const t = useTranslations(`${TRANSLATION_FILES.FAQ_PAGE}.contactCTA`);

  return (
    <div className="mt-16 text-center bg-surface-alt rounded-[var(--radius-xl)] p-8">
      <h3 className="text-xl font-semibold text-text-primary mb-3">{t("title")}</h3>
      <p className="text-text-secondary mb-6">{t("description")}</p>
      <Space size="middle">
        <Link href="/contact">
          <button className="bg-primary-700 hover:bg-primary-500 text-white font-semibold px-6 py-3 rounded-[var(--radius-md)] shadow-[var(--shadow-primary)] hover:shadow-[var(--shadow-primary-hover)] transition-all duration-200 cursor-pointer">
            {t("contactNow")}
          </button>
        </Link>
        <a
          href="tel:0123456789"
          className="border-2 border-primary-700 text-primary-700 hover:bg-primary-50 font-semibold px-6 py-3 rounded-[var(--radius-md)] transition-all duration-200 cursor-pointer"
        >
          {t("callHotline")}
        </a>
      </Space>
    </div>
  );
};
