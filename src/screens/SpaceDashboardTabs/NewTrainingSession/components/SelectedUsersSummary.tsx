import React, { memo } from "react";
import { Box, Typography, Stack, Chip } from "@mui/material";

interface SelectedUsersSummaryProps {
  selectedUsersData: [string | number, string][];
  onRemove: (userId: string) => void;
  onShowMore: () => void;
}

const MAX_VISIBLE_CHIPS = 5;

const SelectedUsersSummary = memo<SelectedUsersSummaryProps>(
  ({ selectedUsersData, onRemove, onShowMore }) => {
    if (selectedUsersData.length === 0) return null;

    const visibleUsers = selectedUsersData.slice(0, MAX_VISIBLE_CHIPS);
    const remainingCount = selectedUsersData.length - MAX_VISIBLE_CHIPS;

    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Selected trainees:
        </Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 0.5 }}>
          {visibleUsers.map((user) => (
            <Chip
              key={user[0]}
              label={user[1]}
              size="small"
              onDelete={() => onRemove(String(user[0]))}
            />
          ))}
          {remainingCount > 0 && (
            <Chip
              label={`+${remainingCount} more`}
              size="small"
              variant="outlined"
              onClick={onShowMore}
            />
          )}
        </Stack>
      </Box>
    );
  }
);

SelectedUsersSummary.displayName = "SelectedUsersSummary";
export default SelectedUsersSummary;