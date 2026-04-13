import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import VehicleMaintenanceRegistration from "../../../../features/appointment/components/vehicle-maintenance-registration";
import { TRANSLATION_FILES } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(TRANSLATION_FILES.CARE_REGISTRATION);

  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}
export default function Page() {
  return <VehicleMaintenanceRegistration />;
}
