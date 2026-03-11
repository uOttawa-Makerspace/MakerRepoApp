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
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Close as CloseIcon,
  Login as LoginIcon,
} from "@mui/icons-material";
import { SignInDialogState } from "../hooks/useSignIn";

interface SignInDialogProps {
  dialog: SignInDialogState;
  signingIn: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const SignInDialog: React.FC<SignInDialogProps> = memo(
  ({ dialog, signingIn, onClose, onConfirm }) => {
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
            <Typography variant="h6" fontWeight={600}>
              Confirm Sign In
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        ) : (
          <DialogTitle>Confirm Sign In</DialogTitle>
        )}

        <DialogContent sx={{ pt: isMobile ? 3 : 2 }}>
          <DialogContentText>
            Are you sure you want to sign in{" "}
            <strong>{dialog.user?.name}</strong>
            {dialog.user?.email && (
              <>
                {" "}
                ({dialog.user.email})
              </>
            )}
            ?
          </DialogContentText>
        </DialogContent>

        <DialogActions
          sx={{ p: isMobile ? 2 : 1, gap: isMobile ? 1 : 0 }}
        >
          <Button
            onClick={onClose}
            disabled={signingIn}
            fullWidth={isMobile}
            variant={isMobile ? "outlined" : "text"}
            size={isMobile ? "large" : "medium"}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            color="primary"
            variant="contained"
            disabled={signingIn}
            fullWidth={isMobile}
            size={isMobile ? "large" : "medium"}
            autoFocus
            startIcon={
              signingIn ? <CircularProgress size={20} /> : <LoginIcon />
            }
          >
            {signingIn ? "Signing In..." : "Sign In"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);

SignInDialog.displayName = "SignInDialog";

export default SignInDialog;