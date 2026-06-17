import React, { memo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

interface UnlinkRfidDialogProps {
  open: boolean;
  cardNumber: string | null;
  userName: string;
  onClose: () => void;
  onConfirm: () => void;
}

const UnlinkRfidDialog: React.FC<UnlinkRfidDialogProps> = memo(
  ({ open, cardNumber, userName, onClose, onConfirm }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    return (
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
              Confirm Unlink
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        ) : (
          <DialogTitle>Confirm RFID Unlink</DialogTitle>
        )}

        <DialogContent sx={{ pt: isMobile ? 3 : 2 }}>
          <DialogContentText>
            Are you sure you want to unlink this RFID card from{" "}
            <strong>{userName}</strong>?
            <br />
            <br />
            Card: <strong>{cardNumber}</strong>
          </DialogContentText>
        </DialogContent>

        <DialogActions
          sx={{ p: isMobile ? 2 : 1, gap: isMobile ? 1 : 0 }}
        >
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
            color="error"
            variant="contained"
            fullWidth={isMobile}
            size={isMobile ? "large" : "medium"}
            autoFocus
          >
            Unlink Card
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);

UnlinkRfidDialog.displayName = "UnlinkRfidDialog";

export default UnlinkRfidDialog;