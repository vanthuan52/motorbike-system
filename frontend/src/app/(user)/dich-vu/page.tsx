import BookingSuggest from "@/components/home-page/booking-suggest";
import CustomerReviews from "@/components/service-page/customer-review";
import FAQSection from "@/components/service-page/faqs-section";
import PriceTable from "@/components/service-page/price-table";
import ServiceCombos from "@/components/service-page/service-combos";
import ServiceHero from "@/components/service-page/service-hero";
import ServiceList from "@/components/service-page/service-list";
import ServiceProcess from "@/components/service-page/service-process";

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
