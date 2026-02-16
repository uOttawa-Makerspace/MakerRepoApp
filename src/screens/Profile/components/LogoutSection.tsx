import React, { memo } from "react";
import { Box, Button, useMediaQuery, useTheme } from "@mui/material";
import { Logout as LogoutIcon } from "@mui/icons-material";

interface LogoutSectionProps {
  onLogoutClick: () => void;
}

const LogoutSection: React.FC<LogoutSectionProps> = memo(
  ({ onLogoutClick }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    return (
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={onLogoutClick}
          size="large"
          fullWidth={isMobile}
        >
          Logout
        </Button>
      </Box>
    );
  }
);

LogoutSection.displayName = "LogoutSection";

export default LogoutSection;