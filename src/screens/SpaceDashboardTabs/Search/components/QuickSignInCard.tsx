import React, { useCallback } from "react";
import {
  Card,
  CardContent,
  Stack,
  Typography,
  TextField,
  InputAdornment,
  CircularProgress,
  Button,
  Autocomplete,
  Box,
  Avatar,
} from "@mui/material";
import {
  Search as SearchIcon,
  Login as LoginIcon,
} from "@mui/icons-material";
import type { SearchUser } from "../types";
import SelectedUserDisplay from "./SelectedUserDisplay";

interface QuickSignInCardProps {
  autocompleteOpen: boolean;
  onAutocompleteOpen: () => void;
  onAutocompleteClose: () => void;
  autocompleteOptions: SearchUser[];
  autocompleteLoading: boolean;
  selectedUser: SearchUser | null;
  onSelectedUserChange: (user: SearchUser | null) => void;
  onInputChange: (event: React.SyntheticEvent, value: string) => void;
  onClearSelected: () => void;
  onSignInClick: (user: SearchUser) => void;
}

const QuickSignInCard = React.memo(
  ({
    autocompleteOpen,
    onAutocompleteOpen,
    onAutocompleteClose,
    autocompleteOptions,
    autocompleteLoading,
    selectedUser,
    onSelectedUserChange,
    onInputChange,
    onClearSelected,
    onSignInClick,
  }: QuickSignInCardProps) => {
    const handleSignIn = useCallback(() => {
      if (selectedUser) onSignInClick(selectedUser);
    }, [selectedUser, onSignInClick]);

    return (
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Quick Sign In
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Search and sign in a user quickly
          </Typography>

          <Stack spacing={2}>
            <Autocomplete
              open={autocompleteOpen}
              onOpen={onAutocompleteOpen}
              onClose={onAutocompleteClose}
              isOptionEqualToValue={(option, value) =>
                option.username === value.username
              }
              getOptionLabel={(option) => option.name}
              options={autocompleteOptions}
              loading={autocompleteLoading}
              value={selectedUser}
              onChange={(_e, newValue) => onSelectedUserChange(newValue)}
              onInputChange={onInputChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search by name or username"
                  placeholder="Start typing to search..."
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <>
                        {autocompleteLoading && (
                          <CircularProgress color="inherit" size={20} />
                        )}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              renderOption={(props, option) => (
                <li {...props} key={option.username}>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={2}
                    width="100%"
                  >
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {option.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={500} noWrap>
                        {option.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                      >
                        @{option.username}
                      </Typography>
                    </Box>
                  </Box>
                </li>
              )}
              noOptionsText="No users found. Try a different search."
            />

            {selectedUser && (
              <SelectedUserDisplay
                user={selectedUser}
                onClear={onClearSelected}
              />
            )}

            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              startIcon={<LoginIcon />}
              onClick={handleSignIn}
              disabled={!selectedUser}
            >
              Sign In Selected User
            </Button>
          </Stack>
        </CardContent>
      </Card>
    );
  }
);

QuickSignInCard.displayName = "QuickSignInCard";

export default QuickSignInCard;