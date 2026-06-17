import { memo } from "react";
import { Stack, Paper, Typography } from "@mui/material";
import type { IssueStats } from "../types";

interface StatCardProps {
  value: number;
  label: string;
  color: string;
}

const StatCard = memo<StatCardProps>(({ value, label, color }) => (
  <Paper sx={{ p: 2, textAlign: "center", flex: 1 }}>
    <Typography variant="h4" sx={{ fontWeight: 700, color }}>
      {value}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
  </Paper>
));

StatCard.displayName = "StatCard";

interface StatsBarProps {
  stats: IssueStats;
}

const StatsBar = memo<StatsBarProps>(({ stats }) => (
  <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
    <StatCard value={stats.open} label="Open Issues" color="error.main" />
    <StatCard value={stats.resolved} label="Resolved" color="success.main" />
    <StatCard value={stats.total} label="Total Issues" color="primary.main" />
  </Stack>
));

StatsBar.displayName = "StatsBar";
export default StatsBar;