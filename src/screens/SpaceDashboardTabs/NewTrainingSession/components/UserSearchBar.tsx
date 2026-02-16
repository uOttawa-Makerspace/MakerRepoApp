import React, { memo } from "react";
import {
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  Button,
} from "@mui/material";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";

interface UserSearchBarProps {
  searchQuery: string;
  hasSelectedUsers: boolean;
  onSearchChange: (query: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

const UserSearchBar = memo<UserSearchBarProps>(
  ({ searchQuery, hasSelectedUsers, onSearchChange, onSelectAll, onDeselectAll }) => (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
      <TextField
        placeholder="Search trainees..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        size="small"
        fullWidth
        InputProps={{
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
        }}
      />
      <Stack direction="row" spacing={1}>
        <Button
          variant="outlined"
          size="small"
          onClick={onSelectAll}
          sx={{ whiteSpace: "nowrap" }}
        >
          Select All
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={onDeselectAll}
          disabled={!hasSelectedUsers}
          sx={{ whiteSpace: "nowrap" }}
        >
          Clear
        </Button>
      </Stack>
    </Stack>
  )
);

UserSearchBar.displayName = "UserSearchBar";
export default UserSearchBar;