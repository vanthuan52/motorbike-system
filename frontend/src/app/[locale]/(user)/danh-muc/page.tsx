import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import CategoryPage from "./_components/CategoryPage";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metaCategorypage");

  return {
    title: t("title"),
    description: t("description"),
  };
}
export default function Page() {
  return (
    <div className="w-full">
      <CategoryPage />
    </div>
  );
}
