import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import VehicleMaintenanceRegistration from "./_components/VehicleMaintenanceRegistration";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metaVehicleMaintenanceRegistrationpage");

  return {
    title: t("title"),
    description: t("description"),
  };
}
export default function Page() {
  return <VehicleMaintenanceRegistration />;
}
