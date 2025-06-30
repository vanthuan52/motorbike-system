import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import MaintenanceHistory from "./_components/MaintenanceHistory";
import { TRANSLATION_FILES } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(TRANSLATION_FILES.MAINTENANCE_HISTORY);

  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}
export default function MaintenanceHistoryLayout() {
  return <MaintenanceHistory />;
}
