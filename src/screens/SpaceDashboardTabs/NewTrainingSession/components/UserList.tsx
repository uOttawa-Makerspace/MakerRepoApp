import React, { memo } from "react";
import {
  Paper,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Checkbox,
  Divider,
} from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";

interface UserListProps {
  users: [string | number, string][];
  selectedUsers: string[];
  searchQuery: string;
  onToggle: (userId: string) => void;
}

const UserListItem = memo<{
  userId: string;
  name: string;
  isSelected: boolean;
  showDivider: boolean;
  onToggle: (userId: string) => void;
}>(({ userId, name, isSelected, showDivider, onToggle }) => (
  <>
    <ListItem disablePadding>
      <ListItemButton onClick={() => onToggle(userId)} dense>
        <Checkbox
          edge="start"
          checked={isSelected}
          tabIndex={-1}
          disableRipple
        />
        <ListItemText
          primary={name}
          slotProps={{
            primary: {
              sx: { fontWeight: isSelected ? 600 : 400 },
            },
          }}
        />
      </ListItemButton>
    </ListItem>
    {showDivider && <Divider />}
  </>
));

UserListItem.displayName = "UserListItem";

const EmptyState = memo<{ searchQuery: string }>(({ searchQuery }) => (
  <Box sx={{ p: 4, textAlign: "center" }}>
    <PersonIcon sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
    <Typography color="text.secondary">
      {searchQuery ? "No users match your search" : "No users available"}
    </Typography>
  </Box>
));

EmptyState.displayName = "EmptyState";

const UserList = memo<UserListProps>(
  ({ users, selectedUsers, searchQuery, onToggle }) => {
    const selectedSet = new Set(selectedUsers);

    return (
      <Paper variant="outlined" sx={{ maxHeight: 400, overflow: "auto" }}>
        {users.length === 0 ? (
          <EmptyState searchQuery={searchQuery} />
        ) : (
          <List disablePadding>
            {users.map((user, index) => {
              const userId = String(user[0]);
              return (
                <UserListItem
                  key={userId}
                  userId={userId}
                  name={user[1]}
                  isSelected={selectedSet.has(userId)}
                  showDivider={index < users.length - 1}
                  onToggle={onToggle}
                />
              );
            })}
          </List>
        )}
      </Paper>
    );
  }
);

UserList.displayName = "UserList";
export default UserList;