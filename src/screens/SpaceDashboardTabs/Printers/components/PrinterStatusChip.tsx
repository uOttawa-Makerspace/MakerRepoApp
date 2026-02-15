import React, { memo } from "react";
import { Chip } from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Build as BuildIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";
import type { Printer, PrinterStatus } from "../types";

export function getPrinterStatus(printer: Printer): PrinterStatus {
  if (printer.maintenance) return "maintenance";
  if (printer.has_issues) return "issues";
  return "available";
}

const STATUS_CONFIG: Record<
  PrinterStatus,
  { icon: React.ReactElement; label: string; color: "warning" | "error" | "success" }
> = {
  maintenance: {
    icon: <BuildIcon />,
    label: "Maintenance",
    color: "warning",
  },
  issues: {
    icon: <ErrorIcon />,
    label: "Issues",
    color: "error",
  },
  available: {
    icon: <CheckCircleIcon />,
    label: "Available",
    color: "success",
  },
};

interface PrinterStatusChipProps {
  printer: Printer;
}

const PrinterStatusChip = memo<PrinterStatusChipProps>(({ printer }) => {
  const status = getPrinterStatus(printer);
  const config = STATUS_CONFIG[status];

  return (
    <Chip
      icon={config.icon}
      label={config.label}
      color={config.color}
      size="small"
    />
  );
});

PrinterStatusChip.displayName = "PrinterStatusChip";
export default PrinterStatusChip;