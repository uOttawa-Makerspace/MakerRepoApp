import React, { memo } from "react";
import { Stack, Button, CircularProgress } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

interface ActionButtonsProps {
  isMobile: boolean;
  submitting: boolean;
  onReset: () => void;
  onSubmit: () => void;
}

const ActionButtons = memo<ActionButtonsProps>(
  ({ isMobile, submitting, onReset, onSubmit }) => (
    <Stack
      direction={{ xs: "column-reverse", sm: "row" }}
      spacing={2}
      sx={{ justifyContent: "flex-end" }}
    >
      <Button
        variant="outlined"
        onClick={onReset}
        disabled={submitting}
        fullWidth={isMobile}
        size="large"
      >
        Reset
      </Button>
      <Button
        variant="contained"
        onClick={onSubmit}
        disabled={submitting}
        fullWidth={isMobile}
        size="large"
        startIcon={
          submitting ? <CircularProgress size={20} /> : <AddIcon />
        }
      >
        {submitting ? "Creating..." : "Create Training Session"}
      </Button>
    </Stack>
  )
);

ActionButtons.displayName = "ActionButtons";
export default ActionButtons;