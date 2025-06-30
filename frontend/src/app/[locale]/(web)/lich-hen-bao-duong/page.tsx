import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import MaintenanceSchedule from "./_components/MaintenanceSchedule";
import { TRANSLATION_FILES } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(TRANSLATION_FILES.MAINTENANCE);

  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}
export default function MaintenanceScheduleLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="container">
        <MaintenanceSchedule />
      </div>
    </div>
  );
}
