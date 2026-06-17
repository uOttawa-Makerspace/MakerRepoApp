import React, { memo, useCallback, useMemo } from "react";
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
import { alpha } from "@mui/material/styles";
import {
  Logout as LogoutIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { User } from "../types";
import { getUserCompliance } from "../utils/userCompliance";
import UserComplianceIcons from "./UserComplianceIcons";

interface MobileUserListItemProps {
  user: User;
  spaceName?: string;
  onNavigate: (username: string) => void;
  onSignOut: (user: User) => void;
}

const MobileUserListItem: React.FC<MobileUserListItemProps> = memo(
  ({ user, spaceName, onNavigate, onSignOut }) => {
    const handleNavigate = useCallback(
      () => onNavigate(user.username),
      [onNavigate, user.username]
    );

    const handleSignOut = useCallback(
      () => onSignOut(user),
      [onSignOut, user]
    );

    const compliance = useMemo(
      () => getUserCompliance(user, spaceName),
      [user, spaceName]
    );

    const borderColor = !compliance.isCompliant
      ? "error.main"
      : user.flagged
        ? "warning.main"
        : "divider";

    const hoverBorderColor = !compliance.isCompliant
      ? "error.dark"
      : user.flagged
        ? "warning.dark"
        : "primary.light";

    return (
      <Paper
        elevation={0}
        sx={{
          mb: 1,
          border: 1,
          borderColor,
          borderRadius: 2,
          overflow: "hidden",
          ...(!compliance.isCompliant && {
            bgcolor: (theme) => alpha(theme.palette.error.main, 0.04),
          }),
          "&:hover": {
            borderColor: hoverBorderColor,
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
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
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
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    noWrap
                  >
                    {user.email}
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <UserComplianceIcons compliance={compliance} />
                  </Box>
                </Box>
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