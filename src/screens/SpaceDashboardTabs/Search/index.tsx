import React from "react";
import {
  Box,
  Typography,
  Stack,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useUserSearch } from "./hooks/useUserSearch";
import QuickSignInCard from "./components/QuickSignInCard";
import AdvancedSearchCard from "./components/AdvancedSearchCard";
import SearchResults from "./SearchResults";
import SignInConfirmDialog from "./components/SignInConfirmDialog";

interface SearchProps {
  handleReloadCurrentUsers: () => void;
}

const Search = ({ handleReloadCurrentUsers }: SearchProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const {
    autocompleteOpen,
    setAutocompleteOpen,
    autocompleteOptions,
    autocompleteLoading,
    selectedUser,
    setSelectedUser,
    handleAutocompleteInputChange,
    clearSelectedUser,
    manualSearchQuery,
    setManualSearchQuery,
    searchResults,
    searching,
    handleManualSearch,
    clearManualSearch,
    signInDialog,
    signingIn,
    openSignInDialog,
    closeSignInDialog,
    confirmSignIn,
    navigateToProfile,
  } = useUserSearch(handleReloadCurrentUsers);

  return (
    <Box>
      {!isMobile && (
        <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
          Search Users
        </Typography>
      )}

      <Stack spacing={3}>
        <QuickSignInCard
          autocompleteOpen={autocompleteOpen}
          onAutocompleteOpen={() => setAutocompleteOpen(true)}
          onAutocompleteClose={() => setAutocompleteOpen(false)}
          autocompleteOptions={autocompleteOptions}
          autocompleteLoading={autocompleteLoading}
          selectedUser={selectedUser}
          onSelectedUserChange={setSelectedUser}
          onInputChange={handleAutocompleteInputChange}
          onClearSelected={clearSelectedUser}
          onSignInClick={openSignInDialog}
        />

        <Box display="flex" alignItems="center" gap={2}>
          <Divider sx={{ flex: 1 }} />
          <Typography variant="body2" color="text.secondary">
            OR
          </Typography>
          <Divider sx={{ flex: 1 }} />
        </Box>

        <AdvancedSearchCard
          query={manualSearchQuery}
          onQueryChange={setManualSearchQuery}
          onSearch={handleManualSearch}
          onClear={clearManualSearch}
          searching={searching}
        />

        <SearchResults
          results={searchResults}
          onSignInClick={openSignInDialog}
          onNavigateToProfile={navigateToProfile}
        />
      </Stack>

      <SignInConfirmDialog
        open={signInDialog.open}
        user={signInDialog.user}
        loading={signingIn}
        onConfirm={confirmSignIn}
        onCancel={closeSignInDialog}
      />
    </Box>
  );
};

export default Search;