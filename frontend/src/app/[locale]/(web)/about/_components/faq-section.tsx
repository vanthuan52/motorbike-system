"use client";

import { useTranslations } from "next-intl";
import { TRANSLATION_FILES } from "@/lib/i18n";
import FaqSection from "@/components/ui/faq-section";

export default function AboutFaqSection() {
  const t = useTranslations(`${TRANSLATION_FILES.ABOUT_PAGE}.faqSection`);

  const items = [0, 1, 2, 3].map((i) => ({
    question: t(`faqs.${i}.question`),
    answer: t(`faqs.${i}.answer`),
  }));

  return (
    <FaqSection
      title={t("heading")}
      items={items}
      seeMoreHref="/cau-hoi-thuong-gap"
    />
  );
}
