import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import BookingSuggest from "@/app/[locale]/(user)/trang-chu/_components/booking-suggest";
import ServiceHero from "./_components/service-hero";
import ServiceList from "./_components/service-list";
import ServiceCombos from "./_components/service-combos";
import ServiceProcess from "./_components/service-process";
import PriceTable from "./_components/price-table";
import CustomerReviews from "./_components/customer-review";
import FAQSection from "./_components/faqs-section";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metaServicepage");

  return {
    title: t("title"),
    description: t("description"),
  };
}
export default function Page() {
  return (
    <div className="w-full">
      <ServiceHero />
      <ServiceList />
      <ServiceCombos />
      <ServiceProcess />
      <PriceTable />
      <CustomerReviews />
      <BookingSuggest />
      <FAQSection />
    </div>
  );
}
