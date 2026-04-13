import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import BannerSection from "../../../../features/home/components/banner-section";
import BlogSection from "../../../../features/home/components/blog-section";
import BookingSuggest from "../../../../features/home/components/booking-suggest";
import ContactSection from "../../../../features/home/components/contact-section";
import MainServicesSection from "../../../../features/home/components/main-service-section";
import ProcessStepsSection from "../../../../features/home/components/process-step-section";
import QuickIntroSection from "../../../../features/home/components/quick-intro-section";
import ServiceComboSection from "../../../../features/home/components/service-combo-section";
import TestimonialsSection from "../../../../features/home/components/testimonials-section";
import WhyChooseUsSection from "../../../../features/home/components/why-choose-us-section";
import GallerySection from "../../../../features/home/components/gallery-section";
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
