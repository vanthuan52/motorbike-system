import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import BlogSection from "@/app/[locale]/(user)/trang-chu/_components/blog-section";
import BookingSuggest from "@/app/[locale]/(user)/trang-chu/_components/booking-suggest";
import ContactSection from "@/app/[locale]/(user)/trang-chu/_components/contact-section";
import HeroSection from "@/app/[locale]/(user)/trang-chu/_components/hero-section";
import MainServicesSection from "@/app/[locale]/(user)/trang-chu/_components/main-service-section";
import ProcessStepsSection from "@/app/[locale]/(user)/trang-chu/_components/process-step-section";
import QuickIntroSection from "@/app/[locale]/(user)/trang-chu/_components/quick-intro-section";
import ServiceComboSection from "@/app/[locale]/(user)/trang-chu/_components/service-combo-section";
import TestimonialsSection from "@/app/[locale]/(user)/trang-chu/_components/testimonials-section";
import WhyChooseUsSection from "@/app/[locale]/(user)/trang-chu/_components/why-choose-us-section";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metaHomepage");

  return {
    title: t("title"),
    description: t("description"),
  };
}
export default function Home() {
  return (
    <div className="w-full">
      <HeroSection />
      <QuickIntroSection />
      <MainServicesSection />
      <WhyChooseUsSection />
      <ProcessStepsSection />
      <ServiceComboSection />
      <TestimonialsSection />
      <BlogSection />
      <BookingSuggest />
      <ContactSection />
    </div>
  );
}
