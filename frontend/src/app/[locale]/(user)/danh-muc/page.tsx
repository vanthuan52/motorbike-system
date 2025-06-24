import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import PartTypePage from "./_components/part-type-page";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metaPartTypePage");

  return {
    title: t("title"),
    description: t("description"),
  };
}
export default function Page() {
  return (
    <div className="w-full">
      <PartTypePage />
    </div>
  );
}
