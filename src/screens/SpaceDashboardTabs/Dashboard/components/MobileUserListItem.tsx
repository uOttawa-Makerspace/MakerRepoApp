import React, { memo, useCallback } from "react";
import {
  Paper,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Box,
  Typography,
  Chip,
  IconButton,
} from "@mui/material";
import {
  Logout as LogoutIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { User } from "../types";

interface MobileUserListItemProps {
  user: User;
  onNavigate: (username: string) => void;
  onSignOut: (user: User) => void;
}

const MobileUserListItem: React.FC<MobileUserListItemProps> = memo(
  ({ user, onNavigate, onSignOut }) => {
    const handleNavigate = useCallback(
      () => onNavigate(user.username),
      [onNavigate, user.username]
    );

    const handleSignOut = useCallback(
      () => onSignOut(user),
      [onSignOut, user]
    );

    return (
      <Paper
        elevation={0}
        sx={{
          mb: 1,
          border: 1,
          borderColor: user.flagged ? "warning.main" : "divider",
          borderRadius: 2,
          overflow: "hidden",
          "&:hover": {
            borderColor: user.flagged ? "warning.dark" : "primary.light",
            boxShadow: 1,
          },
          transition: "all 0.2s ease",
        }}
      >
        <ListItem
          disablePadding
          secondaryAction={
            <IconButton
              edge="end"
              onClick={handleSignOut}
              sx={{
                mr: 1,
                color: "error.main",
                "&:hover": {
                  bgcolor: "error.light",
                  color: "white",
                },
                transition: "all 0.2s ease",
              }}
            >
              <LogoutIcon />
            </IconButton>
          }
        >
          <ListItemButton onClick={handleNavigate}>
            <ListItemAvatar>
              <Avatar
                src={user.avatar_url}
                alt={user.name}
                sx={{ width: 48, height: 48 }}
              >
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Typography variant="body1" fontWeight={600}>
                    {user.name}
                  </Typography>
                  {user.flagged && (
                    <Chip
                      icon={<WarningIcon />}
                      label="Flagged"
                      size="small"
                      color="warning"
                      sx={{ height: 20 }}
                    />
                  )}
                </Box>
              }
              secondary={
                <Typography
                  variant="body2"
                  color="text.secondary"
                  noWrap
                >
                  {user.email}
                </Typography>
              }
            />
          </ListItemButton>
        </ListItem>
      </Paper>
    );
  }
);

MobileUserListItem.displayName = "MobileUserListItem";

export default MobileUserListItem;