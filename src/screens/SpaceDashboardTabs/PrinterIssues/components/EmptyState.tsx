import React, { memo } from "react";
import { Paper, Typography } from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";

interface EmptyStateProps {
  showResolved: boolean;
  hasSearch: boolean;
  isMobile: boolean;
}

const MESSAGES = {
  search: {
    title: "No issues match your search",
    subtitle: "Try a different search term",
  },
  resolved: {
    title: "No resolved issues yet",
    subtitle: "Great! All issues are still open",
  },
  open: {
    title: "No open issues",
    subtitle: "Great! No printer problems to report",
  },
} as const;

const EmptyState = memo<EmptyStateProps>(
  ({ showResolved, hasSearch, isMobile }) => {
    const key = hasSearch ? "search" : showResolved ? "resolved" : "open";
    const { title, subtitle } = MESSAGES[key];
    const Icon = showResolved && !hasSearch ? CheckCircleIcon : ErrorIcon;
    const iconColor =
      showResolved && !hasSearch ? "success.main" : "text.secondary";

    return (
      <Paper
        sx={{
          p: isMobile ? 4 : 8,
          textAlign: "center",
          bgcolor: "background.default",
        }}
      >
        <Icon sx={{ fontSize: isMobile ? 48 : 64, color: iconColor, mb: 2 }} />
        <Typography
          variant={isMobile ? "subtitle1" : "h6"}
          color="text.secondary"
          gutterBottom
        >
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </Paper>
    );
  }
);

EmptyState.displayName = "EmptyState";
export default EmptyState;