import React, { memo, ReactNode } from "react";
import { Box, Card, CardContent, useTheme } from "@mui/material";

interface LoginContainerProps {
  children: ReactNode;
}

const LoginContainer: React.FC<LoginContainerProps> = memo(
  ({ children }) => {
    const theme = useTheme();

    return (
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          p: 2,
        }}
      >
        <Card
          elevation={24}
          sx={{
            maxWidth: 450,
            width: "100%",
            borderRadius: 3,
            maxHeight: "95vh",
            overflow: "auto",
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            {children}
          </CardContent>
        </Card>
      </Box>
    );
  }
);

LoginContainer.displayName = "LoginContainer";

export default LoginContainer;