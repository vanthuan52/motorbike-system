import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import CareerPage from "./_components/CareerPage";

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
      <CareerPage />
    </div>
  );
}
