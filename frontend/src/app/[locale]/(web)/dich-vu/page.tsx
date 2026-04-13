import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ServiceCTA from "./_components/service-cta";
import { TRANSLATION_FILES } from "@/lib/i18n";
import CareServiceBrowse from "./_components/care-service-browse";
import CustomerReviews from "./_components/customer-review";
import FAQSection from "./_components/faqs-section";
import ServiceHero from "./_components/service-hero";
import ServiceProcess from "./_components/service-process";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(TRANSLATION_FILES.SERVICE_PAGE);

  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}
export default function Page() {
  return (
    <div className="w-full">
      <ServiceHero />
      <CareServiceBrowse />
      <ServiceProcess />
      <CustomerReviews />
      <div className="container pb-16">
        <ServiceCTA />
      </div>
      <FAQSection />
    </div>
  );
}
