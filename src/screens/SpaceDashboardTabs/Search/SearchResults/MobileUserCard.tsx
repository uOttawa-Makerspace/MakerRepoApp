import React from "react";
import {
  Card,
  CardContent,
  Stack,
  Box,
  Avatar,
  Typography,
  Chip,
  Divider,
  Button,
} from "@mui/material";
import {
  Warning as WarningIcon,
  Login as LoginIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import type { User } from "../types";

interface MobileUserCardProps {
  user: User;
  onSignInClick: (user: User) => void;
  onNavigateToProfile: (username: string) => void;
}

const MobileUserCard = React.memo(
  ({ user, onSignInClick, onNavigateToProfile }: MobileUserCardProps) => (
    <Card
      sx={{
        mb: 2,
        border: 1,
        borderColor: user.flagged ? "warning.main" : "divider",
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Box display="flex" alignItems="start" gap={2}>
            <Avatar
              src={user.avatar_url}
              alt={user.name}
              sx={{ width: 56, height: 56 }}
            >
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography
                variant="h6"
                fontWeight={600}
                onClick={() => onNavigateToProfile(user.username)}
                sx={{
                  color: "primary.main",
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
                noWrap
              >
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                @{user.username}
              </Typography>
              {user.flagged && (
                <Chip
                  icon={<WarningIcon />}
                  label="Flagged"
                  color="warning"
                  size="small"
                  sx={{ mt: 1 }}
                />
              )}
            </Box>
          </Box>

          <Divider />

          <Box display="flex" alignItems="center" gap={1}>
            <EmailIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary" noWrap>
              {user.email}
            </Typography>
          </Box>

          <Button
            fullWidth
            variant="contained"
            color="primary"
            startIcon={<LoginIcon />}
            onClick={() => onSignInClick(user)}
            size="large"
          >
            Sign In User
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
);

MobileUserCard.displayName = "MobileUserCard";

export default MobileUserCard;