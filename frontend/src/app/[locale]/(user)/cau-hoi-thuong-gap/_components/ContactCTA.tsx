"use client";

import { Space } from "antd";
import { useTranslations } from "next-intl";
import { CustomLink } from "@/components/CustomerLink/CustomLink";

export const ContactCTA = () => {
  const t = useTranslations("faqPage.contactCTA");

  return (
    <div className="mt-16 text-center bg-gray-50 rounded-xl p-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{t("title")}</h3>
      <p className="text-gray-600 mb-6">{t("description")}</p>
      <Space size="middle">
        <CustomLink href="/contact">
          <button className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-md transition cursor-pointer">
            {t("contactNow")}
          </button>
        </CustomLink>
        <a
          href="tel:0123456789"
          className="border border-gray-800 text-gray-800 hover:bg-gray-100 font-semibold px-6 py-3 rounded-md transition cursor-pointer"
        >
          {t("callHotline")}
        </a>
      </Space>
    </div>
  );
};
