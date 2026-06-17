import React, { memo, useCallback } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import ChangeSpace from "../../../components/ChangeSpace";
import { SpaceData } from "../types";

interface SpaceDrawerProps {
  open: boolean;
  isInitialLoading: boolean;
  usersError: string | null;
  inSpaceUsers: SpaceData | null;
  onClose: () => void;
  onReloadUsers: () => void;
}

const SpaceDrawer: React.FC<SpaceDrawerProps> = memo(
  ({
    open,
    isInitialLoading,
    usersError,
    inSpaceUsers,
    onClose,
    onReloadUsers,
  }) => {
    const handleSpaceChange = useCallback(() => {
      onReloadUsers();
      onClose();
    }, [onReloadUsers, onClose]);

    return (
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        slotProps={{
          paper: {
            sx: {
              width: { xs: "100%", sm: 400 },
              maxWidth: "100vw",
            },
          },
        }}
      >
        <Box>
          <Box
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              bgcolor: "primary.main",
              color: "primary.contrastText",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Change Space
            </Typography>
            <IconButton onClick={onClose} sx={{ color: "inherit" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ p: 2 }}>
            {isInitialLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : usersError ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                {usersError}
              </Alert>
            ) : (
              <ChangeSpace
                inSpaceUsers={inSpaceUsers}
                handleReloadCurrentUsers={handleSpaceChange}
              />
            )}
          </Box>
        </Box>
      </Drawer>
    );
  }
);

SpaceDrawer.displayName = "SpaceDrawer";

export default SpaceDrawer;