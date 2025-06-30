import { Metadata } from "next";
import CheckoutPage from "./_components/CheckoutPage";
import { getTranslations } from "next-intl/server";
import { TRANSLATION_FILES } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(TRANSLATION_FILES.CHECKOUT_PAGE);

  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}
export default function Page() {
  return <CheckoutPage />;
}
