import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import AboutHeroSection from "@/app/[locale]/(user)/about/_components/about-hero-section";
import AwardsSection from "@/app/[locale]/(user)/about/_components/awards-section";
import FaqSection from "@/app/[locale]/(user)/about/_components/faq-section";
import FeaturedServices from "@/app/[locale]/(user)/about/_components/feature-service";
import HistorySection from "@/app/[locale]/(user)/about/_components/history-section";
import SocialCommunitySection from "@/app/[locale]/(user)/about/_components/social-community";
import StaffSection from "@/app/[locale]/(user)/about/_components/staff-section";
import TechnologySection from "@/app/[locale]/(user)/about/_components/technology-section";
import ContactSection from "@/app/[locale]/(user)/trang-chu/_components/contact-section";
import WhyChooseUsSection from "@/app/[locale]/(user)/trang-chu/_components/why-choose-us-section";
import CertificationAndTestimonials from "@/app/[locale]/(user)/dich-vu/_components/certificate-section";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metaAboutpage");

  return {
    title: t("title"),
    description: t("description"),
  };
}
export default function AboutPage() {
  return (
    <div className="w-full">
      <AboutHeroSection />
      <HistorySection />
      <StaffSection />
      <FeaturedServices />
      <CertificationAndTestimonials />
      <TechnologySection />
      <WhyChooseUsSection />
      <ContactSection />
      <FaqSection />
      <AwardsSection />
      <SocialCommunitySection />
    </div>
  );
}
