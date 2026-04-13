import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ServiceCTA from "../../../../features/vehicle-service/components/service-cta";
import { TRANSLATION_FILES } from "@/lib/i18n";
import CareServiceBrowse from "../../../../features/vehicle-service/components/care-service-browse";
import CustomerReviews from "../../../../features/vehicle-service/components/customer-review";
import FAQSection from "../../../../features/vehicle-service/components/faqs-section";
import ServiceHero from "../../../../features/vehicle-service/components/service-hero";
import ServiceProcess from "../../../../features/vehicle-service/components/service-process";

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
