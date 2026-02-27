import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import type { TrainingSession } from "../types";

interface CertifyDialogProps {
  open: boolean;
  session: TrainingSession | null;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const CertifyDialog = React.memo(
  ({ open, session, loading, onConfirm, onCancel }: CertifyDialogProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    return (
      <Dialog
        open={open}
        onClose={onCancel}
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
              Certify Trainees
            </Typography>
            <IconButton onClick={onCancel} aria-label="Close">
              <CloseIcon />
            </IconButton>
          </Box>
        ) : (
          <DialogTitle>Certify Trainees</DialogTitle>
        )}

        <DialogContent sx={{ pt: isMobile ? 3 : 2 }}>
          <DialogContentText>
            Are you sure you want to certify all trainees in{" "}
            <strong>{session?.training.name_en}</strong>?
            <br />
            <br />
            This will grant them the certification for this training.
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ p: isMobile ? 2 : 1, gap: isMobile ? 1 : 0 }}>
          <Button
            onClick={onCancel}
            disabled={loading}
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
            disabled={loading}
            fullWidth={isMobile}
            size={isMobile ? "large" : "medium"}
            autoFocus
            startIcon={
              loading ? <CircularProgress size={20} /> : <CheckCircleIcon />
            }
          >
            {loading ? "Certifying..." : "Certify"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);

CertifyDialog.displayName = "CertifyDialog";

export default CertifyDialog;