import React, { useCallback } from "react";
import {
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
} from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";
import type { StatusFilter } from "../types";

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (filter: StatusFilter) => void;
  isMobile: boolean;
}

const STATUS_OPTIONS: {
  value: StatusFilter;
  label: string;
  activeColor: "primary" | "success" | "warning";
}[] = [
  { value: "all", label: "All", activeColor: "primary" },
  { value: "completed", label: "Completed", activeColor: "success" },
  { value: "pending", label: "Pending", activeColor: "warning" },
];

const SearchAndFilters = React.memo(
  ({
    searchQuery,
    onSearchChange,
    onClearSearch,
    statusFilter,
    onStatusFilterChange,
    isMobile,
  }: SearchAndFiltersProps) => {
    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value),
      [onSearchChange]
    );

    return (
      <Stack spacing={2}>
        <TextField
          placeholder="Search sessions..."
          value={searchQuery}
          onChange={handleInputChange}
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
                  <IconButton
                    size="small"
                    onClick={onClearSearch}
                    aria-label="Clear search"
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ) : null,
            },
          }}
        />

        <Stack direction="row" spacing={1}>
          {STATUS_OPTIONS.map(({ value, label, activeColor }) => (
            <Chip
              key={value}
              label={label}
              onClick={() => onStatusFilterChange(value)}
              color={statusFilter === value ? activeColor : "default"}
              variant={statusFilter === value ? "filled" : "outlined"}
              size="small"
            />
          ))}
        </Stack>
      </Stack>
    );
  }
);

SearchAndFilters.displayName = "SearchAndFilters";

export default SearchAndFilters;