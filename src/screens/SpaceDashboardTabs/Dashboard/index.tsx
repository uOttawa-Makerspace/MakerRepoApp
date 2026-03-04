import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Box, useMediaQuery, useTheme } from "@mui/material";

import { DashboardProps } from "./types";
import { useFilteredUsers } from "./hooks/useFilteredUsers";
import { useSignOut } from "./hooks/useSignOut";

import Rfid from "../../../components/Rfid";
import SearchBar from "./components/SearchBar";
import EmptyState from "./components/EmptyState";
import MobileUserList from "./components/MobileUserList";
import DesktopUserTable from "./components/DesktopUserTable";
import SignOutDialog from "./components/SignOutDialog";

const Dashboard: React.FC<DashboardProps> = ({
  inSpaceUsers,
  handleReloadCurrentUsers,
  spaceId,
  spaceName,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const {
    searchQuery,
    sortField,
    sortOrder,
    filteredAndSortedUsers,
    handleSearchChange,
    clearSearch,
    handleSort,
  } = useFilteredUsers(inSpaceUsers);

  const {
    signOutDialog,
    signingOut,
    openSignOutDialog,
    closeSignOutDialog,
    confirmSignOut,
  } = useSignOut(handleReloadCurrentUsers);

  const navigateToProfile = useCallback(
    (username: string) => {
      navigate(`/profile/${username}`);
    },
    [navigate]
  );

  const hasUsers = inSpaceUsers.length > 0;
  const hasResults = filteredAndSortedUsers.length > 0;

  return (
    <Box>
      {/* RFID */}
      <Box sx={{ px: isMobile ? 2 : 0, py: isMobile ? 2 : 0 }}>
        <Rfid spaceId={spaceId} />
      </Box>

      {/* Search */}
      <SearchBar
        value={searchQuery}
        onChange={handleSearchChange}
        onClear={clearSearch}
      />

      {/* User List */}
      {!hasUsers || !hasResults ? (
        <EmptyState hasUsers={hasUsers} searchQuery={searchQuery} />
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
      )}

      {/* Sign Out Dialog */}
      <SignOutDialog
        dialog={signOutDialog}
        signingOut={signingOut}
        onClose={closeSignOutDialog}
        onConfirm={confirmSignOut}
      />
    </Box>
  );
};

export default Dashboard;