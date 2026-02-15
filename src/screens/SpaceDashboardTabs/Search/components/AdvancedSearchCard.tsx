import React, { useCallback } from "react";
import {
  Card,
  CardContent,
  Stack,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";

interface AdvancedSearchCardProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
  searching: boolean;
}

const AdvancedSearchCard = React.memo(
  ({
    query,
    onQueryChange,
    onSearch,
    onClear,
    searching,
  }: AdvancedSearchCardProps) => {
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        if (event.key === "Enter") onSearch();
      },
      [onSearch]
    );

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => onQueryChange(e.target.value),
      [onQueryChange]
    );

    return (
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Advanced Search
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Search by username, name, or email
          </Typography>

          <Stack spacing={2}>
            <TextField
              fullWidth
              placeholder="Enter username, name, or email"
              value={query}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: query ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={onClear}
                      aria-label="Clear search"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />

            <Button
              fullWidth
              variant="outlined"
              color="primary"
              size="large"
              startIcon={
                searching ? <CircularProgress size={20} /> : <SearchIcon />
              }
              onClick={onSearch}
              disabled={!query.trim() || searching}
            >
              {searching ? "Searching..." : "Search Users"}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    );
  }
);

AdvancedSearchCard.displayName = "AdvancedSearchCard";

export default AdvancedSearchCard;