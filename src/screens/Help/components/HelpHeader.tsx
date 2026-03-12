import React, { memo } from "react";
import { Paper, Typography, useTheme } from "@mui/material";
import { Help as HelpIcon } from "@mui/icons-material";
import EnvVariables from "../../../utils/EnvVariables";

const HelpHeader: React.FC = memo(() => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 3,
        textAlign: "center",
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: "white",
        borderRadius: "0 0 16px 16px", // flat top, rounded bottom
      }}
    >
      <HelpIcon sx={{ fontSize: 48, mb: 1 }} />
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Help & Support
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.9 }}>
        MakerRepo v{EnvVariables.app_version} {EnvVariables.app_release_type}
      </Typography>
    </Paper>
  );
});

HelpHeader.displayName = "HelpHeader";

export default HelpHeader;