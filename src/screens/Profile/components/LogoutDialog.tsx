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
  Logout as LogoutIcon,
} from "@mui/icons-material";

interface LogoutDialogProps {
  open: boolean;
  loggingOut: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutDialog: React.FC<LogoutDialogProps> = memo(
  ({ open, loggingOut, onClose, onConfirm }) => {
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
            <Typography variant="h6" fontWeight={600}>
              Confirm Logout
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        ) : (
          <DialogTitle>Confirm Logout</DialogTitle>
        )}

        <DialogContent sx={{ pt: isMobile ? 3 : 2 }}>
          <DialogContentText>
            Are you sure you want to logout from MakerRepo?
          </DialogContentText>
        </DialogContent>

        <DialogActions
          sx={{ p: isMobile ? 2 : 1, gap: isMobile ? 1 : 0 }}
        >
          <Button
            onClick={onClose}
            disabled={loggingOut}
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
            disabled={loggingOut}
            fullWidth={isMobile}
            size={isMobile ? "large" : "medium"}
            autoFocus
            startIcon={
              loggingOut ? (
                <CircularProgress size={20} />
              ) : (
                <LogoutIcon />
              )
            }
          >
            {loggingOut ? "Logging Out..." : "Logout"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);

LogoutDialog.displayName = "LogoutDialog";

export default LogoutDialog;