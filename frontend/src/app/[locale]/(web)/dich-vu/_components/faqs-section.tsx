"use client";

import { useTranslations } from "next-intl";
import { TRANSLATION_FILES } from "@/lib/i18n";
import FaqSection from "@/components/ui/faq-section";

const FAQ_KEYS = [
  { questionKey: "howOften", answerKey: "howOftenAnswer" },
  { questionKey: "needBooking", answerKey: "needBookingAnswer" },
  { questionKey: "warranty", answerKey: "warrantyAnswer" },
];

export default function FAQSection() {
  const t = useTranslations(`${TRANSLATION_FILES.SERVICE_PAGE}.faqSection`);

  const items = FAQ_KEYS.map(({ questionKey, answerKey }) => ({
    question: t(questionKey),
    answer: t(answerKey),
  }));

  return (
    <FaqSection
      title={t("title")}
      items={items}
      seeMoreHref="/cau-hoi-thuong-gap"
      seeMoreLabel={t("seeMore")}
    />
  );
}
