import React from "react";

import ContactMainSection from "@/app/(user)/contact/_components/contact-main-section";
import ContactMapSection from "@/app/(user)/contact/_components/contact-map-section";

function ContactPage() {
  return (
    <React.Fragment>
      <ContactMainSection />
      <ContactMapSection />
    </React.Fragment>
  );
}

export default ContactPage;
