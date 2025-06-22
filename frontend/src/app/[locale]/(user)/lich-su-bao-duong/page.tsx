import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import MaintenanceHistory from "./_components/MaintenanceHistory";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metaMaintenanceHistorypage");

  return {
    title: t("title"),
    description: t("description"),
  };
}
export default function MaintenanceHistoryLayout() {
  return <MaintenanceHistory />;
}
