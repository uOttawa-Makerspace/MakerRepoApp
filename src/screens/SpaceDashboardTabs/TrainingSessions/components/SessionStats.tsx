import React from "react";
import { Stack, Chip } from "@mui/material";
import type { SessionStats as SessionStatsType } from "../types";

interface SessionStatsProps {
  stats: SessionStatsType;
  isMobile: boolean;
}

const SessionStats = React.memo(({ stats, isMobile }: SessionStatsProps) => {
  const size = isMobile ? "small" : "medium";

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}
    >
      <Chip label={`${stats.total} Total`} color="primary" size={size} />
      <Chip label={`${stats.completed} Completed`} color="success" size={size} />
      <Chip label={`${stats.pending} Pending`} color="warning" size={size} />
    </Stack>
  );
});

SessionStats.displayName = "SessionStats";

export default SessionStats;