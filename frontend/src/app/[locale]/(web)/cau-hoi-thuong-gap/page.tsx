import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import FaqPage from "./_components/FaqPage";
import { TRANSLATION_FILES } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(TRANSLATION_FILES.FAQ_PAGE);

  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}
export default function FAQPage() {
  return <FaqPage />;
}
