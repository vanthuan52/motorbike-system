import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ProductListPage from "./_components/ProductListPage";
import { TRANSLATION_FILES } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(TRANSLATION_FILES.PRODUCT);

  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}
export default function Page() {
  return (
    <div className="w-full">
      <ProductListPage />
    </div>
  );
}
