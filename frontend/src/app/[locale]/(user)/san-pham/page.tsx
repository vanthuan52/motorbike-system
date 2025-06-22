import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ProductListPage from "./_components/ProductListPage";
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metaProductpage");

  return {
    title: t("title"),
    description: t("description"),
  };
}
export default function Page() {
  return (
    <div className="w-full">
      <ProductListPage />
    </div>
  );
}
