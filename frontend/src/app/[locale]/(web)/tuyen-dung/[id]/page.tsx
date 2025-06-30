import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import CareerDetailsPage from "./_components/CareerDetailsPage";
import { TRANSLATION_FILES } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(TRANSLATION_FILES.HIRING_DETAIL);

  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}
export default function page() {
  return (
    <div className="w-full">
      <CareerDetailsPage />
    </div>
  );
}
