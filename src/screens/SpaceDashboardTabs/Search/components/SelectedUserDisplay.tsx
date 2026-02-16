import React from "react";
import {
  Paper,
  Stack,
  Box,
  Avatar,
  Typography,
  IconButton,
} from "@mui/material";
import { Clear as ClearIcon } from "@mui/icons-material";
import type { SearchUser } from "../types";

interface SelectedUserDisplayProps {
  user: SearchUser;
  onClear: () => void;
}

const SelectedUserDisplay = React.memo(
  ({ user, onClear }: SelectedUserDisplayProps) => (
    <Paper
      variant="outlined"
      sx={{ p: 2, bgcolor: "primary.50", borderColor: "primary.main" }}
    >
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Box display="flex" alignItems="center" gap={2} flex={1}>
          <Avatar>{user.name.charAt(0).toUpperCase()}</Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body1" fontWeight={600} noWrap>
              {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              @{user.username}
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={onClear} aria-label="Clear selection">
          <ClearIcon />
        </IconButton>
      </Stack>
    </Paper>
  )
);

SelectedUserDisplay.displayName = "SelectedUserDisplay";

export default SelectedUserDisplay;