import React, { memo, useCallback } from "react";
import {
  Paper,
  Box,
  Stack,
  Typography,
  IconButton,
  Chip,
} from "@mui/material";
import { SwapHoriz as SwapIcon } from "@mui/icons-material";
import MobileTabSelector from "./MobileTabSelector";

interface MobileHeaderProps {
  spaceName: string;
  userCount: number;
  flaggedCount: number;
  isInitialLoading: boolean;
  tabIndex: number;
  onTabChange: (index: number) => void;
  onOpenDrawer: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = memo(
  ({
    spaceName,
    userCount,
    flaggedCount,
    isInitialLoading,
    tabIndex,
    onTabChange,
    onOpenDrawer,
  }) => (
    <Paper
      elevation={0}
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1100,
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      {/* Space Info Bar */}
      <Box sx={{ px: 2, pt: 2, pb: 1 }}>
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: "center", mb: 1 }}
        >
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }} noWrap>
              {spaceName}
            </Typography>
          </Box>
          <IconButton
            onClick={onOpenDrawer}
            size="small"
            sx={{
              bgcolor: "primary.main",
              color: "white",
              width: 36,
              height: 36,
              "&:hover": {
                bgcolor: "primary.dark",
                transform: "scale(1.05)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <SwapIcon fontSize="small" />
          </IconButton>
        </Stack>

        {!isInitialLoading && (
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            <Chip
              label={`${userCount} user${userCount !== 1 ? "s" : ""}`}
              size="small"
              color="primary"
              variant="outlined"
            />
            {flaggedCount > 0 && (
              <Chip
                label={`${flaggedCount} flagged`}
                size="small"
                color="warning"
                variant="outlined"
              />
            )}
          </Stack>
        )}
      </Box>

      {/* Tab Selector */}
      <MobileTabSelector tabIndex={tabIndex} onTabChange={onTabChange} />
    </Paper>
  )
);

MobileHeader.displayName = "MobileHeader";

export default MobileHeader;