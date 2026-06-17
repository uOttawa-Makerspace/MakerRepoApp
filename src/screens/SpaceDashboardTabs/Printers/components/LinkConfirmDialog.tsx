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

interface LinkConfirmDialogProps {
  open: boolean;
  isMobile: boolean;
  printerName: string;
  userName: string;
  onClose: () => void;
  onConfirm: () => void;
}

const LinkConfirmDialog = memo<LinkConfirmDialogProps>(
  ({ open, isMobile, printerName, userName, onClose, onConfirm }) => (
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
            Confirm Link
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      ) : (
        <DialogTitle>Confirm Printer Link</DialogTitle>
      )}

      <DialogContent sx={{ pt: isMobile ? 3 : 2 }}>
        <DialogContentText>
          Link <strong>{printerName}</strong> to{" "}
          <strong>{userName}</strong>?
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ p: isMobile ? 2 : 1, gap: isMobile ? 1 : 0 }}>
        <Button
          onClick={onClose}
          fullWidth={isMobile}
          variant={isMobile ? "outlined" : "text"}
          size={isMobile ? "large" : "medium"}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="primary"
          fullWidth={isMobile}
          size={isMobile ? "large" : "medium"}
          autoFocus
        >
          Confirm Link
        </Button>
      </DialogActions>
    </Dialog>
  )
);

LinkConfirmDialog.displayName = "LinkConfirmDialog";
export default LinkConfirmDialog;