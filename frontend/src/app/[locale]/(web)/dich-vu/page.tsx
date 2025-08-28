import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import BookingSuggest from "@/app/[locale]/(web)/(home)/_components/booking-suggest";
import ServiceHero from "./_components/service-hero";
import ServiceList from "./_components/service-list";
import ServiceProcess from "./_components/service-process";
import CustomerReviews from "./_components/customer-review";
import FAQSection from "./_components/faqs-section";
import { TRANSLATION_FILES } from "@/lib/i18n";

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
      <ServiceList />
      <ServiceProcess />
      <CustomerReviews />
      <BookingSuggest />
      <FAQSection />
    </div>
  );
}
