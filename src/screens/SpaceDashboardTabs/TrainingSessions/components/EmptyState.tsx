import React from "react";
import { Paper, Typography } from "@mui/material";
import { School as SchoolIcon } from "@mui/icons-material";

interface EmptyStateProps {
  hasActiveFilters: boolean;
  isMobile: boolean;
}

const EmptyState = React.memo(
  ({ hasActiveFilters, isMobile }: EmptyStateProps) => (
    <Paper
      sx={{
        p: isMobile ? 4 : 8,
        textAlign: "center",
        bgcolor: "background.default",
      }}
    >
      <SchoolIcon
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
        {hasActiveFilters
          ? "No sessions match your filters"
          : "No training sessions yet"}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {hasActiveFilters
          ? "Try adjusting your search or filters"
          : "Training sessions will appear here"}
      </Typography>
    </Paper>
  )
);

EmptyState.displayName = "EmptyState";

export default EmptyState;