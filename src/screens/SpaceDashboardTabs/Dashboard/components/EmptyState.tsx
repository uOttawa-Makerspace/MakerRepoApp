import React, { memo } from "react";
import {
  Paper,
  Typography,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";

interface EmptyStateProps {
  hasUsers: boolean;
  searchQuery: string;
}

const EmptyState: React.FC<EmptyStateProps> = memo(
  ({ hasUsers, searchQuery }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    if (!hasUsers) {
      return (
        <Paper
          sx={{
            mx: isMobile ? 2 : 0,
            p: isMobile ? 4 : 8,
            textAlign: "center",
            bgcolor: "background.default",
          }}
        >
          <PersonIcon
            sx={{
              fontSize: isMobile ? 48 : 64,
              color: "text.secondary",
              mb: 2,
            }}
          />
          <Typography
            variant={isMobile ? "subtitle1" : "h6"}
            color="text.secondary"
            gutterBottom
          >
            No users signed in
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Users will appear here when they sign in
          </Typography>
        </Paper>
      );
    }

    return (
      <Alert severity="info" sx={{ mx: isMobile ? 2 : 0 }}>
        No users match your search "{searchQuery}"
      </Alert>
    );
  }
);

EmptyState.displayName = "EmptyState";

export default EmptyState;