import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import AboutHeroSection from "../../../../features/about/components/about-hero-section";
import AwardsSection from "../../../../features/about/components/awards-section";
import FaqSection from "../../../../features/about/components/faq-section";
import FeaturedServices from "../../../../features/about/components/feature-service";
import HistorySection from "../../../../features/about/components/history-section";
import SocialCommunitySection from "../../../../features/about/components/social-community";
import StaffSection from "../../../../features/about/components/staff-section";
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
