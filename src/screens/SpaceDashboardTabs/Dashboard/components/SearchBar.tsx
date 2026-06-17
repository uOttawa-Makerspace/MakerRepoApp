import React, { memo, useCallback } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

const SearchBar: React.FC<SearchBarProps> = memo(
  ({ value, onChange, onClear }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
      },
      [onChange]
    );

    return (
      <Box sx={{ px: isMobile ? 2 : 0, mb: 2 }}>
        <TextField
          placeholder="Search username, name, or email"
          value={value}
          onChange={handleChange}
          size={isMobile ? "medium" : "small"}
          fullWidth
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: value ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={onClear}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ) : null,
            },
          }}
        />
      </Box>
    );
  }
);

SearchBar.displayName = "SearchBar";

export default SearchBar;