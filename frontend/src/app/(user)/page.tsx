import HeroSection from "@/components/home-page/hero-section";
import MainServicesSection from "@/components/home-page/main-service-section";
import ProcessStepsSection from "@/components/home-page/process-step-section";
import QuickIntroSection from "@/components/home-page/quick-intro-section";
import ServiceComboSection from "@/components/home-page/service-combo-section";
import WhyChooseUsSection from "@/components/home-page/why-choose-us-section";

export default function Home() {
  return (
    <div className="w-full">
      <HeroSection />
      <QuickIntroSection />
      <MainServicesSection />
      <WhyChooseUsSection />
      <ProcessStepsSection />
      <ServiceComboSection />
    </div>
  );
}
