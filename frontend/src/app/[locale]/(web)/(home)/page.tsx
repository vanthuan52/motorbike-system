import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import BannerSection from "./_components/banner-section";
import BlogSection from "./_components/blog-section";
import BookingSuggest from "./_components/booking-suggest";
import ContactSection from "./_components/contact-section";
import MainServicesSection from "./_components/main-service-section";
import ProcessStepsSection from "./_components/process-step-section";
import QuickIntroSection from "./_components/quick-intro-section";
import ServiceComboSection from "./_components/service-combo-section";
import TestimonialsSection from "./_components/testimonials-section";
import WhyChooseUsSection from "./_components/why-choose-us-section";
import GallerySection from "./_components/gallery-section";
import { TRANSLATION_FILES } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(TRANSLATION_FILES.HOME);

  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}
export default function Home() {
  return (
    <div className="w-full">
      <BannerSection />
      {/* <HeroSection /> */}
      <QuickIntroSection />
      <MainServicesSection />
      <WhyChooseUsSection />
      <ProcessStepsSection />
      <ServiceComboSection />
      <GallerySection />
      <TestimonialsSection />
      <BlogSection />
      <BookingSuggest />
      <ContactSection />
    </div>
  );
}
