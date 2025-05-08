import AboutHeroSection from "@/components/about-page/about-hero-section";
import AwardsSection from "@/components/about-page/awards-section";
import FaqSection from "@/components/about-page/faq-section";
import FeaturedServices from "@/components/about-page/feature-service";
import HistorySection from "@/components/about-page/history-section";
import SocialCommunitySection from "@/components/about-page/social-community";
import StaffSection from "@/components/about-page/staff-section";
import TechnologySection from "@/components/about-page/technology-section";
import ContactSection from "@/components/home-page/contact-section";
import WhyChooseUsSection from "@/components/home-page/why-choose-us-section";
import CertificationAndTestimonials from "@/components/service-page/certificate-section";
import React from "react";

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
