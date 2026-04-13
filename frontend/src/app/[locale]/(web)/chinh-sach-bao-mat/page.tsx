import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import PrivacyPolicy from "../../../../features/privacy-policy/components/privacy-policy";
import { TRANSLATION_FILES } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(TRANSLATION_FILES.PRIVACY_POLICY);

  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}
export default function PrivacyPolicyLayout() {
  return <PrivacyPolicy />;
}
