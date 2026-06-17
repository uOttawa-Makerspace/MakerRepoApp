import React, { memo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import type { PrinterIssue } from "../types";

interface ResolveDialogProps {
  open: boolean;
  issue: PrinterIssue | null;
  isMobile: boolean;
  resolving: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ResolveDialog = memo<ResolveDialogProps>(
  ({ open, issue, isMobile, resolving, onClose, onConfirm }) => (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      fullScreen={isMobile}
    >
      {isMobile ? (
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Resolve Issue
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      ) : (
        <DialogTitle>Resolve Issue</DialogTitle>
      )}

      <DialogContent sx={{ pt: isMobile ? 3 : 2 }}>
        <DialogContentText>
          Mark this issue as resolved?
          <br />
          <br />
          <strong>{issue?.summary}</strong>
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ p: isMobile ? 2 : 1, gap: isMobile ? 1 : 0 }}>
        <Button
          onClick={onClose}
          disabled={resolving}
          fullWidth={isMobile}
          variant={isMobile ? "outlined" : "text"}
          size={isMobile ? "large" : "medium"}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="success"
          variant="contained"
          disabled={resolving}
          fullWidth={isMobile}
          size={isMobile ? "large" : "medium"}
          autoFocus
        >
          {resolving ? "Resolving..." : "Mark as Resolved"}
        </Button>
      </DialogActions>
    </Dialog>
  )
);

ResolveDialog.displayName = "ResolveDialog";
export default ResolveDialog;