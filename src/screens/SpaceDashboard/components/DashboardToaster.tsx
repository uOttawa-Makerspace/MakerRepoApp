import React, { memo } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import { Toaster } from "react-hot-toast";
import { TOASTER_OPTIONS } from "../constants";

const DashboardToaster: React.FC = memo(() => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Toaster
      position={isMobile ? "top-center" : "bottom-right"}
      toastOptions={TOASTER_OPTIONS}
    />
  );
});

DashboardToaster.displayName = "DashboardToaster";

export default DashboardToaster;