import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import CareerDetailsPage from "./_components/CareerDetailsPage";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metaHiringpage");

  return {
    title: t("title"),
    description: t("description"),
  };
}
export default function page() {
  return (
    <div className="w-full">
      <CareerDetailsPage />
    </div>
  );
}
