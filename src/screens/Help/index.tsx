import React from "react";
import { Box } from "@mui/material";

import { useContactForm } from "./hooks/useContactForm";

import HelpHeader from "./components/HelpHeader";
import FAQSection from "./components/FAQSection";
import ContactForm from "./components/ContactForm";
import DirectContactInfo from "./components/DirectContactInfo";

const Help: React.FC = () => {
  const {
    formData,
    formErrors,
    submitting,
    submitSuccess,
    handleInputChange,
    handleSubmit,
    dismissSuccess,
  } = useContactForm();

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", pb: 10 }}>
      <HelpHeader />

      <FAQSection />

      <ContactForm
        formData={formData}
        formErrors={formErrors}
        submitting={submitting}
        submitSuccess={submitSuccess}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        onDismissSuccess={dismissSuccess}
      />

      <DirectContactInfo />
    </Box>
  );
};

export default Help;