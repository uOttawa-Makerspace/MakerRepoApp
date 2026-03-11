import React, { useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Chip,
  Box,
  IconButton,
  Divider,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Close as CloseIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as PendingIcon,
  Group as GroupIcon,
} from "@mui/icons-material";
import type { TrainingSession, User } from "../types";

interface UsersDialogProps {
  open: boolean;
  session: TrainingSession | null;
  onClose: () => void;
}

const AVATAR_COLORS = [
  "#1976d2",
  "#9c27b0",
  "#2e7d32",
  "#0288d1",
  "#ed6c02",
  "#d32f2f",
  "#00bcd4",
  "#ff5722",
  "#607d8b",
];

const getAvatarColor = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const getInitials = (name: string): string =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const UserRow = React.memo(
  ({ user, isCertified }: { user: User; isCertified: boolean }) => {
    const theme = useTheme();

    return (
      <ListItem
        sx={{
          py: 1.5,
          px: 2,
          "&:hover": {
            bgcolor: alpha(theme.palette.action.hover, 0.04),
          },
        }}
      >
        <ListItemAvatar>
          <Avatar
            sx={{
              bgcolor: getAvatarColor(user.name),
              width: 40,
              height: 40,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {getInitials(user.name)}
          </Avatar>
        </ListItemAvatar>

        <ListItemText
          primary={
            <Typography variant="body1" fontWeight={500}>
              {user.name}
            </Typography>
          }
          secondary={
            <Box
              component="span"
              sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}
            >
              <Typography variant="caption" color="text.secondary">
                @{user.username}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          }
        />

        <Chip
          icon={
            isCertified ? (
              <CheckCircleIcon fontSize="small" />
            ) : (
              <PendingIcon fontSize="small" />
            )
          }
          label={isCertified ? "Certified" : "Pending"}
          size="small"
          color={isCertified ? "success" : "default"}
          variant={isCertified ? "filled" : "outlined"}
          sx={{ minWidth: 100 }}
        />
      </ListItem>
    );
  }
);
UserRow.displayName = "UserRow";

const UsersDialog: React.FC<UsersDialogProps> = ({
  open,
  session,
  onClose,
}) => {
  const theme = useTheme();

  const certifiedUserIds = useMemo(() => {
    if (!session) return new Set<number>();
    return new Set(
      session.certifications
        .filter((cert) => cert.active)
        .map((cert) => cert.user_id)
    );
  }, [session]);

  if (!session) return null;

  const users: User[] = session.users ?? [];
  const certifiedCount = users.filter((u) => certifiedUserIds.has(u.id)).length;
  const pendingCount = users.length - certifiedCount;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          pb: 1,
        }}
      >
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="h6" fontWeight={600} noWrap>
            {session.training.name_en}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {session.course} · {session.space.name}
            {session.level ? ` · ${session.level}` : ""}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ ml: 1 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      {/* Summary chips */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          px: 3,
          py: 1.5,
          bgcolor: alpha(theme.palette.primary.main, 0.04),
          flexWrap: "wrap",
        }}
      >
        <Chip
          icon={<GroupIcon fontSize="small" />}
          label={`${users.length} user${users.length !== 1 ? "s" : ""}`}
          size="small"
          variant="outlined"
        />
        <Chip
          icon={<CheckCircleIcon fontSize="small" />}
          label={`${certifiedCount} certified`}
          size="small"
          color="success"
          variant="outlined"
        />
        {pendingCount > 0 && (
          <Chip
            icon={<PendingIcon fontSize="small" />}
            label={`${pendingCount} pending`}
            size="small"
            color="warning"
            variant="outlined"
          />
        )}
      </Box>

      <Divider />

      {/* User list */}
      <DialogContent sx={{ px: 1, py: 0 }}>
        {users.length === 0 ? (
          <Box textAlign="center" py={4}>
            <PersonIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
            <Typography color="text.secondary">
              No users in this session
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {users.map((user, index) => (
              <React.Fragment key={user.id}>
                <UserRow
                  user={user}
                  isCertified={certifiedUserIds.has(user.id)}
                />
                {index < users.length - 1 && (
                  <Divider variant="inset" component="li" />
                )}
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>

      <Divider />

      {/* Footer */}
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UsersDialog;