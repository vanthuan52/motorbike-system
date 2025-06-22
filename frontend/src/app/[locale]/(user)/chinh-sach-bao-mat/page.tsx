import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import PrivacyPolicy from "./_components/PrivacyPolicy";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metaPrivacyPolicypage");

  return {
    title: t("title"),
    description: t("description"),
  };
}
export default function PrivacyPolicyLayout() {
  return <PrivacyPolicy />;
}
