import React, { memo } from "react";
import { Chip } from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";

interface StatusChipProps {
  resolved?: boolean;
}

const StatusChip = memo<StatusChipProps>(({ resolved }) =>
  resolved ? (
    <Chip
      icon={<CheckCircleIcon />}
      label="Resolved"
      size="small"
      color="success"
    />
  ) : (
    <Chip icon={<ErrorIcon />} label="Open" size="small" color="error" />
  )
);

StatusChip.displayName = "StatusChip";
export default StatusChip;