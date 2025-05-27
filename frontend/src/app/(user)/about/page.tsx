import AboutHeroSection from "@/app/(user)/about/_components/about-hero-section";
import AwardsSection from "@/app/(user)/about/_components/awards-section";
import FaqSection from "@/app/(user)/about/_components/faq-section";
import FeaturedServices from "@/app/(user)/about/_components/feature-service";
import HistorySection from "@/app/(user)/about/_components/history-section";
import SocialCommunitySection from "@/app/(user)/about/_components/social-community";
import StaffSection from "@/app/(user)/about/_components/staff-section";
import TechnologySection from "@/app/(user)/about/_components/technology-section";
import ContactSection from "@/components/home-page/contact-section";
import WhyChooseUsSection from "@/components/home-page/why-choose-us-section";
import CertificationAndTestimonials from "@/app/(user)/dich-vu/_components/certificate-section";

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
