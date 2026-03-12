import React, { memo } from "react";
import { Paper, Stack, Avatar, Box, Typography, Chip, useTheme } from "@mui/material";
import { User } from "../types";
import { getRoleColor, getRoleIcon } from "../utils";

interface ProfileHeaderProps {
  user: User;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = memo(({ user }) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: "white",
        p: 3,
        borderRadius: "0 0 16px 16px", // flat top, rounded bottom
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar
          src={user.avatar_url}
          sx={{ width: 80, height: 80, border: "4px solid white" }}
        >
          {user.name?.charAt(0).toUpperCase()}
        </Avatar>
        <Box flexGrow={1}>
          <Typography variant="h4" fontWeight={700}>
            {user.name}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            @{user.username}
          </Typography>
        </Box>
        <Chip
          icon={getRoleIcon(user.role)}
          label={user.role.replace("_", " ").toUpperCase()}
          color={getRoleColor(user.role)}
          sx={{ fontWeight: 600, display: { xs: "none", sm: "flex" } }}
        />
      </Stack>
    </Paper>
  );
});

ProfileHeader.displayName = "ProfileHeader";

export default ProfileHeader;