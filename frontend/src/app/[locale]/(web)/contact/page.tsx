import React from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ContactMainSection from "@/features/contact/components/contact-main-section";
import ContactMapSection from "@/features/contact/components/contact-map-section";
import { TRANSLATION_FILES } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(TRANSLATION_FILES.CONTACT_PAGE);

  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}
function ContactPage() {
  return (
    <React.Fragment>
      <ContactMainSection />
      <ContactMapSection />
    </React.Fragment>
  );
}

export default ContactPage;
