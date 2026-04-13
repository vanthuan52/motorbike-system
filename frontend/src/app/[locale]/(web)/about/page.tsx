import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import AboutHeroSection from "./_components/about-hero-section";
import AwardsSection from "./_components/awards-section";
import FaqSection from "./_components/faq-section";
import FeaturedServices from "./_components/feature-service";
import HistorySection from "./_components/history-section";
import SocialCommunitySection from "./_components/social-community";
import StaffSection from "./_components/staff-section";
import WhyChooseUsSection from "../../../../features/home/components/why-choose-us-section";

import { TRANSLATION_FILES } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(TRANSLATION_FILES.ABOUT_PAGE);

  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}
export default function AboutPage() {
  return (
    <div className="w-full">
      <AboutHeroSection />
      <HistorySection />
      <StaffSection />
      <FeaturedServices />
      <WhyChooseUsSection />
      <FaqSection />
    </div>
  );
}
