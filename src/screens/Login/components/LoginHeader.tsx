import React, { memo } from "react";
import { Box, Typography } from "@mui/material";
import logo from "../../../assets/logo192.png";

const logoStyles = {
  width: 80,
  height: 80,
  mb: 2,
  animation: "fadeIn 0.5s ease-in",
  "@keyframes fadeIn": {
    from: { opacity: 0, transform: "scale(0.9)" },
    to: { opacity: 1, transform: "scale(1)" },
  },
} as const;

const LoginHeader: React.FC = memo(() => (
  <Box textAlign="center" mb={4}>
    <Box component="img" src={logo} alt="MakeRepo Logo" sx={logoStyles} />
    <Typography variant="h4" fontWeight={700} gutterBottom>
      Welcome Back
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Sign in to continue to MakerRepo
    </Typography>
  </Box>
));

LoginHeader.displayName = "LoginHeader";

export default LoginHeader;