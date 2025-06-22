import { Metadata } from "next";
import CheckoutPage from "./_components/CheckoutPage";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metaCheckoutpage");

  return {
    title: t("title"),
    description: t("description"),
  };
}
export default function Page() {
  return <CheckoutPage />;
}
