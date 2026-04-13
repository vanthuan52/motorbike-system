import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { TRANSLATION_FILES } from "@/lib/i18n";
import OrderSuccessPage from "../../../../features/order/components/order-success-page";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(TRANSLATION_FILES.ORDER_SUCCESS);
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default function Page() {
  return <OrderSuccessPage />;
}
