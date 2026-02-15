import React, { memo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Stack,
  Paper,
  Divider,
  Button,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

interface ConfirmationDialogProps {
  open: boolean;
  isMobile: boolean;
  trainingName: string;
  trainingLevel: string;
  trainingCourse: string;
  instructorName: string;
  traineeCount: number;
  onClose: () => void;
  onConfirm: () => void;
}

const DetailRow = memo<{
  label: string;
  value: string;
}>(({ label, value }) => (
  <Box>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2" fontWeight={600}>
      {value}
    </Typography>
  </Box>
));

DetailRow.displayName = "DetailRow";

const ConfirmationDialog = memo<ConfirmationDialogProps>(
  ({
    open,
    isMobile,
    trainingName,
    trainingLevel,
    trainingCourse,
    instructorName,
    traineeCount,
    onClose,
    onConfirm,
  }) => (
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
            Confirm Training Session
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      ) : (
        <DialogTitle>Confirm Training Session</DialogTitle>
      )}

      <DialogContent sx={{ pt: isMobile ? 3 : 2 }}>
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            Please review the details before creating:
          </Typography>

          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={1.5} divider={<Divider />}>
              <DetailRow label="Training" value={trainingName} />
              <DetailRow
                label="Level & Course"
                value={`${trainingLevel} - ${trainingCourse}`}
              />
              <DetailRow label="Instructor" value={instructorName} />
              <DetailRow
                label="Trainees"
                value={`${traineeCount} user${traineeCount !== 1 ? "s" : ""}`}
              />
            </Stack>
          </Paper>
        </Stack>
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
          fullWidth={isMobile}
          size={isMobile ? "large" : "medium"}
          autoFocus
        >
          Create Session
        </Button>
      </DialogActions>
    </Dialog>
  )
);

ConfirmationDialog.displayName = "ConfirmationDialog";
export default ConfirmationDialog;