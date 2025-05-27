import BookingSuggest from "@/components/home-page/booking-suggest";
import CustomerReviews from "@/app/(user)/dich-vu/_components/customer-review";
import FAQSection from "@/app/(user)/dich-vu/_components/faqs-section";
import PriceTable from "@/app/(user)/dich-vu/_components/price-table";
import ServiceCombos from "@/app/(user)/dich-vu/_components/service-combos";
import ServiceHero from "@/app/(user)/dich-vu/_components/service-hero";
import ServiceList from "@/app/(user)/dich-vu/_components/service-list";
import ServiceProcess from "@/app/(user)/dich-vu/_components/service-process";

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
