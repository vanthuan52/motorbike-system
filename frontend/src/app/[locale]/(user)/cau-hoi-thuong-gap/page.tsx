import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import FaqPage from "./_components/FaqPage";
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metaFaqpage");

  return {
    title: t("title"),
    description: t("description"),
  };
}
export default function FAQPage() {
  return <FaqPage />;
}
