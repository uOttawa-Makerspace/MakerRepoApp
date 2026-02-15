import React from "react";
import { Box } from "@mui/material";

import { useContactForm } from "./hooks/useContactForm";
import { useLogout } from "./hooks/useLogout";

import HelpHeader from "./components/HelpHeader";
import FAQSection from "./components/FAQSection";
import ContactForm from "./components/ContactForm";
import DirectContactInfo from "./components/DirectContactInfo";
import LogoutSection from "./components/LogoutSection";
import LogoutDialog from "./components/LogoutDialog";

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

  const {
    logoutDialogOpen,
    loggingOut,
    openLogoutDialog,
    closeLogoutDialog,
    handleLogout,
  } = useLogout();

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: { xs: 2, sm: 3 }, pb: 10 }}>
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

      <LogoutSection onLogoutClick={openLogoutDialog} />

      <LogoutDialog
        open={logoutDialogOpen}
        loggingOut={loggingOut}
        onClose={closeLogoutDialog}
        onConfirm={handleLogout}
      />
    </Box>
  );
};

export default Help;