import React from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import ContactMainSection from "@/app/[locale]/(user)/contact/_components/contact-main-section";
import ContactMapSection from "@/app/[locale]/(user)/contact/_components/contact-map-section";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metaContactpage");

  return {
    title: t("title"),
    description: t("description"),
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
