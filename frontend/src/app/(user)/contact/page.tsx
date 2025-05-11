import React from "react";

import ContactMainSection from "@/components/contact-page/contact-main-section";
import ContactMapSection from "@/components/contact-page/contact-map-section";

function ContactPage() {
  return (
    <React.Fragment>
      <ContactMainSection />
      <ContactMapSection />
    </React.Fragment>
  );
}

export default ContactPage;
