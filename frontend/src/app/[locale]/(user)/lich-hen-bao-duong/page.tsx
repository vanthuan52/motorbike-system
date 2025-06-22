import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import MaintenanceSchedule from "./_components/MaintenanceSchedule";
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metaMaintenanceSchedulepage");

  return {
    title: t("title"),
    description: t("description"),
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
