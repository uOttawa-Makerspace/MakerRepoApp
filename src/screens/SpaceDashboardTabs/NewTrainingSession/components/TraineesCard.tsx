import React, { memo, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  IconButton,
  Alert,
  Collapse,
  Stack,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import UserSearchBar from "./UserSearchBar";
import UserList from "./UserList";
import SelectedUsersSummary from "./SelectedUsersSummary";

interface TraineesCardProps {
  filteredUsers: [string | number, string][];
  selectedUsers: string[];
  selectedUsersData: [string | number, string][];
  searchQuery: string;
  error?: string;
  onSearchChange: (query: string) => void;
  onUserToggle: (userId: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

const TraineesCard = memo<TraineesCardProps>(
  ({
    filteredUsers,
    selectedUsers,
    selectedUsersData,
    searchQuery,
    error,
    onSearchChange,
    onUserToggle,
    onSelectAll,
    onDeselectAll,
  }) => {
    const [showUserList, setShowUserList] = useState(false);

    const toggleUserList = useCallback(() => {
      setShowUserList((prev) => !prev);
    }, []);

    const showList = useCallback(() => {
      setShowUserList(true);
    }, []);

    return (
      <Card>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="h6" fontWeight={600}>
                Trainees
              </Typography>
              <Chip
                label={`${selectedUsers.length} selected`}
                color={selectedUsers.length > 0 ? "primary" : "default"}
                size="small"
              />
            </Box>
            <IconButton onClick={toggleUserList} size="small">
              {showUserList ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Collapse in={showUserList}>
            <Stack spacing={2}>
              <UserSearchBar
                searchQuery={searchQuery}
                hasSelectedUsers={selectedUsers.length > 0}
                onSearchChange={onSearchChange}
                onSelectAll={onSelectAll}
                onDeselectAll={onDeselectAll}
              />
              <UserList
                users={filteredUsers}
                selectedUsers={selectedUsers}
                searchQuery={searchQuery}
                onToggle={onUserToggle}
              />
            </Stack>
          </Collapse>

          {!showUserList && (
            <SelectedUsersSummary
              selectedUsersData={selectedUsersData}
              onRemove={onUserToggle}
              onShowMore={showList}
            />
          )}
        </CardContent>
      </Card>
    );
  }
);

TraineesCard.displayName = "TraineesCard";
export default TraineesCard;