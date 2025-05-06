import React from "react";

import AboutHeroSection from "./HeroSection";
import AboutGeneralIntroduce from "./GeneralIntroduce";
import AboutStaff from "./Staff";
import AboutFigure from "./Figure";
import AboutFeedback from "./Feedback";

export default function AboutPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-6 py-16 space-y-24">
      <AboutHeroSection />

      <AboutGeneralIntroduce />

      <AboutStaff />

      <AboutFigure />

      <AboutFeedback />
    </div>
  );
}