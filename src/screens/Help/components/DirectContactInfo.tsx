import React, { memo } from "react";
import { Paper, Typography } from "@mui/material";
import { SUPPORT_EMAIL } from "../constants";

const DirectContactInfo: React.FC = memo(() => (
  <Paper
    variant="outlined"
    sx={{
      mt: 3,
      p: 2,
      borderRadius: 2,
      bgcolor: "background.default",
    }}
  >
    <Typography variant="body2" color="text.secondary" textAlign="center">
      Or email us directly at{" "}
      <Typography
        component="a"
        href={`mailto:${SUPPORT_EMAIL}`}
        sx={{
          color: "primary.main",
          textDecoration: "none",
          fontWeight: 600,
          "&:hover": { textDecoration: "underline" },
        }}
      >
        {SUPPORT_EMAIL}
      </Typography>
    </Typography>
  </Paper>
));

DirectContactInfo.displayName = "DirectContactInfo";

export default DirectContactInfo;