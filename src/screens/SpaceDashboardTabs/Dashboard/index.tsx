import React, { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { DashboardProps } from "./types";
import { useFilteredUsers } from "./hooks/useFilteredUsers";
import { useSignOut } from "./hooks/useSignOut";
import { useSignIn } from "./hooks/useSignIn";
import { useGlobalSearch } from "./hooks/useGlobalSearch";

import Rfid from "../../../components/Rfid";
import SearchBar from "./components/SearchBar";
import EmptyState from "./components/EmptyState";
import MobileUserList from "./components/MobileUserList";
import DesktopUserTable from "./components/DesktopUserTable";
import SignOutDialog from "./components/SignOutDialog";
import SignInDialog from "./components/SignInDialog";
import GlobalSearchResults from "./components/GlobalSearchResults";

const Dashboard: React.FC<DashboardProps> = ({
  inSpaceUsers,
  handleReloadCurrentUsers,
  spaceId,
  spaceName,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  // Client-side filtering of signed-in users
  const {
    searchQuery,
    sortField,
    sortOrder,
    filteredAndSortedUsers,
    handleSearchChange,
    clearSearch,
    handleSort,
  } = useFilteredUsers(inSpaceUsers);

  // Server-side search for all users
  const signedInUsernames = useMemo(
    () => new Set(inSpaceUsers.map((u) => u.username)),
    [inSpaceUsers]
  );

  const { globalResults, globalSearchLoading } = useGlobalSearch(
    searchQuery,
    signedInUsernames
  );

  const {
    signOutDialog,
    signingOut,
    openSignOutDialog,
    closeSignOutDialog,
    confirmSignOut,
  } = useSignOut(handleReloadCurrentUsers);

  // Wrap the reload callback to also clear search after sign-in
  const handleReloadAfterSignIn = useCallback(() => {
    handleReloadCurrentUsers();
    clearSearch();
  }, [handleReloadCurrentUsers, clearSearch]);

  const {
    signInDialog,
    signingIn,
    openSignInDialog,
    closeSignInDialog,
    confirmSignIn,
  } = useSignIn(handleReloadAfterSignIn);

  const navigateToProfile = useCallback(
    (username: string) => {
      navigate(`/profile/${username}`);
    },
    [navigate]
  );

  const hasUsers = inSpaceUsers.length > 0;
  const hasResults = filteredAndSortedUsers.length > 0;
  const isSearching = searchQuery.trim().length > 0;

  return (
    <Box>
      {/* RFID */}
      <Box sx={{ px: isMobile ? 2 : 0, py: isMobile ? 2 : 0 }}>
        <Rfid spaceId={spaceId} onSignIn={handleReloadCurrentUsers} />
      </Box>

      {/* Search */}
      <SearchBar
        value={searchQuery}
        onChange={handleSearchChange}
        onClear={clearSearch}
      />

      {/* When not searching: original dashboard behavior */}
      {!isSearching ? (
        !hasUsers ? (
          <EmptyState hasUsers={false} searchQuery="" />
        ) : isMobile ? (
          <MobileUserList
            users={filteredAndSortedUsers}
            spaceName={spaceName}
            onNavigate={navigateToProfile}
            onSignOut={openSignOutDialog}
          />
        ) : (
          <DesktopUserTable
            users={filteredAndSortedUsers}
            sortField={sortField}
            sortOrder={sortOrder}
            spaceName={spaceName}
            onSort={handleSort}
            onNavigate={navigateToProfile}
            onSignOut={openSignOutDialog}
          />
        )
      ) : (
        // Active search: show sign-in suggestions FIRST, then signed-in users
        <>
          {/* Global search results (sign-in suggestions) */}
          <GlobalSearchResults
            results={globalResults}
            loading={globalSearchLoading}
            searchQuery={searchQuery}
            onSignIn={openSignInDialog}
            onNavigate={navigateToProfile}
          />

          {/* Filtered signed-in users */}
          {hasResults ? (
            <Box sx={{ mt: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, mb: 1.5, px: isMobile ? 2 : 0 }}
              >
                Currently signed in
              </Typography>
              {isMobile ? (
                <MobileUserList
                  users={filteredAndSortedUsers}
                  spaceName={spaceName}
                  onNavigate={navigateToProfile}
                  onSignOut={openSignOutDialog}
                />
              ) : (
                <DesktopUserTable
                  users={filteredAndSortedUsers}
                  sortField={sortField}
                  sortOrder={sortOrder}
                  spaceName={spaceName}
                  onSort={handleSort}
                  onNavigate={navigateToProfile}
                  onSignOut={openSignOutDialog}
                />
              )}
            </Box>
          ) : hasUsers ? (
            <Alert severity="info" sx={{ mt: 3, mx: isMobile ? 2 : 0 }}>
              No signed-in users match &ldquo;{searchQuery}&rdquo;
            </Alert>
          ) : (
            <Box sx={{ mt: 3 }}>
              <EmptyState hasUsers={false} searchQuery="" />
            </Box>
          )}
        </>
      )}

      {/* Global search results when NOT searching */}
      {!isSearching && (
        <GlobalSearchResults
          results={globalResults}
          loading={globalSearchLoading}
          searchQuery={searchQuery}
          onSignIn={openSignInDialog}
          onNavigate={navigateToProfile}
        />
      )}

      {/* Dialogs */}
      <SignOutDialog
        dialog={signOutDialog}
        signingOut={signingOut}
        onClose={closeSignOutDialog}
        onConfirm={confirmSignOut}
      />
      <SignInDialog
        dialog={signInDialog}
        signingIn={signingIn}
        onClose={closeSignInDialog}
        onConfirm={confirmSignIn}
      />
    </Box>
  );
};

export default Dashboard;