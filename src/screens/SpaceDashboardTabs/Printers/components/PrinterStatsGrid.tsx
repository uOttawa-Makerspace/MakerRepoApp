import React, { memo } from "react";
import { Box, Paper, Typography } from "@mui/material";
import type { PrinterStats } from "../types";

interface StatItemProps {
  value: number;
  label: string;
  color: string;
}

const StatItem = memo<StatItemProps>(({ value, label, color }) => (
  <Paper sx={{ p: 2, textAlign: "center" }}>
    <Typography variant="h4" sx={{ fontWeight: 700 }} color={color}>
      {value}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
  </Paper>
));

StatItem.displayName = "StatItem";

const STAT_CONFIG: {
  key: keyof PrinterStats;
  label: string;
  color: string;
}[] = [
  { key: "total", label: "Total Printers", color: "primary.main" },
  { key: "available", label: "Available", color: "success.main" },
  { key: "maintenance", label: "Maintenance", color: "warning.main" },
  { key: "issues", label: "Issues", color: "error.main" },
];

interface PrinterStatsGridProps {
  stats: PrinterStats;
}

const PrinterStatsGrid = memo<PrinterStatsGridProps>(({ stats }) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(4, 1fr)" },
      gap: 2,
      mb: 3,
    }}
  >
    {STAT_CONFIG.map(({ key, label, color }) => (
      <StatItem key={key} value={stats[key]} label={label} color={color} />
    ))}
  </Box>
));

PrinterStatsGrid.displayName = "PrinterStatsGrid";
export default PrinterStatsGrid;