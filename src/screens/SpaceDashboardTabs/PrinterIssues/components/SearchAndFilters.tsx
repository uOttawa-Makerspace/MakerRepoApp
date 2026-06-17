import React, { memo } from "react";
import {
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
} from "@mui/material";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import type { IssueStats } from "../types";

interface SearchAndFiltersProps {
  searchQuery: string;
  showResolved: boolean;
  stats: IssueStats;
  isMobile: boolean;
  onSearchChange: (query: string) => void;
  onToggleResolved: (show: boolean) => void;
}

const SearchAndFilters = memo<SearchAndFiltersProps>(
  ({
    searchQuery,
    showResolved,
    stats,
    isMobile,
    onSearchChange,
    onToggleResolved,
  }) => (
    <Stack spacing={2} sx={{ mb: 3 }}>
      <TextField
        placeholder="Search issues..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        size={isMobile ? "medium" : "small"}
        fullWidth
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchQuery ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => onSearchChange("")}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ) : null,
          },
        }}
      />
      <Stack direction="row" spacing={1}>
        <Chip
          label={`Open (${stats.open})`}
          onClick={() => onToggleResolved(false)}
          color={!showResolved ? "error" : "default"}
          variant={!showResolved ? "filled" : "outlined"}
          size="small"
        />
        <Chip
          label={`Resolved (${stats.resolved})`}
          onClick={() => onToggleResolved(true)}
          color={showResolved ? "success" : "default"}
          variant={showResolved ? "filled" : "outlined"}
          size="small"
        />
      </Stack>
    </Stack>
  )
);

SearchAndFilters.displayName = "SearchAndFilters";
export default SearchAndFilters;