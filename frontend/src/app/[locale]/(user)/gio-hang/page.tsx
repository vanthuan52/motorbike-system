import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import CartPage from "./_components/CartPage";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metaCartpage");

  return {
    title: t("title"),
    description: t("description"),
  };
}
export default function Page() {
  return <CartPage />;
}
