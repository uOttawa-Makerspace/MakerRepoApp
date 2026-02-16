import React, { memo } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import { Toaster } from "react-hot-toast";
import { TOASTER_OPTIONS } from "../constants";

const MOBILE_BOTTOM_NAV_HEIGHT = 56;
const TOAST_GAP = 8;

const DashboardToaster: React.FC = memo(() => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Toaster
      position={isMobile ? "bottom-center" : "bottom-right"}
      containerStyle={
        isMobile
          ? { bottom: MOBILE_BOTTOM_NAV_HEIGHT + TOAST_GAP }
          : undefined
      }
      toastOptions={{
        ...TOASTER_OPTIONS,
        // Force a default duration so toasts always auto-dismiss
        duration: TOASTER_OPTIONS?.duration ?? 4000,
        success: {
          ...(TOASTER_OPTIONS as any)?.success,
          duration: (TOASTER_OPTIONS as any)?.success?.duration ?? 3000,
        },
        error: {
          ...(TOASTER_OPTIONS as any)?.error,
          duration: (TOASTER_OPTIONS as any)?.error?.duration ?? 5000,
        },
      }}
    />
  );
});

DashboardToaster.displayName = "DashboardToaster";

export default DashboardToaster;