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
import { SignOutDialogState } from "../types";

interface SignOutDialogProps {
  dialog: SignOutDialogState;
  signingOut: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const SignOutDialog: React.FC<SignOutDialogProps> = memo(
  ({ dialog, signingOut, onClose, onConfirm }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    return (
      <Dialog
        open={dialog.open}
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
              Confirm Sign Out
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        ) : (
          <DialogTitle>Confirm Sign Out</DialogTitle>
        )}

        <DialogContent sx={{ pt: isMobile ? 3 : 2 }}>
          <DialogContentText>
            Are you sure you want to sign out{" "}
            <strong>{dialog.user?.name}</strong>?
          </DialogContentText>
        </DialogContent>

        <DialogActions
          sx={{ p: isMobile ? 2 : 1, gap: isMobile ? 1 : 0 }}
        >
          <Button
            onClick={onClose}
            disabled={signingOut}
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
            disabled={signingOut}
            fullWidth={isMobile}
            size={isMobile ? "large" : "medium"}
            autoFocus
          >
            {signingOut ? "Signing Out..." : "Sign Out"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);

SignOutDialog.displayName = "SignOutDialog";

export default SignOutDialog;