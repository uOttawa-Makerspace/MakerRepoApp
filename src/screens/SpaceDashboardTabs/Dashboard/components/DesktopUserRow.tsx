import React, { memo, useCallback, useMemo } from "react";
import {
  TableRow,
  TableCell,
  Stack,
  Avatar,
  Box,
  Typography,
  Chip,
  Button,
  Tooltip,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  Logout as LogoutIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { User } from "../types";
import { getUserCompliance } from "../utils/userCompliance";
import UserComplianceIcons from "./UserComplianceIcons";

interface DesktopUserRowProps {
  user: User;
  spaceName?: string;
  onNavigate: (username: string) => void;
  onSignOut: (user: User) => void;
}

const DesktopUserRow: React.FC<DesktopUserRowProps> = memo(
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

    return (
      <TableRow
        hover
        sx={{
          "&:last-child td, &:last-child th": { border: 0 },
          cursor: "pointer",
          ...(!compliance.isCompliant && {
            bgcolor: (theme) => alpha(theme.palette.error.main, 0.06),
            "& td:first-of-type": {
              borderLeft: "4px solid",
              borderLeftColor: "error.main",
            },
          }),
        }}
      >
        <TableCell onClick={handleNavigate}>
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <Avatar
              src={user.avatar_url}
              alt={user.name}
              sx={{ width: 40, height: 40 }}
            >
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                  color: "primary.main",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {user.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                @{user.username}
              </Typography>
            </Box>
          </Stack>
        </TableCell>
        <TableCell>
          <Typography variant="body2">{user.email}</Typography>
        </TableCell>
        <TableCell>
          <UserComplianceIcons compliance={compliance} />
        </TableCell>
        <TableCell>
          {user.flagged ? (
            <Tooltip title="This user has been flagged">
              <Chip
                icon={<WarningIcon />}
                label="Flagged"
                color="warning"
                size="small"
              />
            </Tooltip>
          ) : compliance.isCompliant ? (
            <Chip label="Active" color="success" size="small" />
          ) : (
            <Tooltip
              title={`Missing: ${compliance.missingItems.join(", ")}`}
            >
              <Chip
                icon={<WarningIcon />}
                label="Incomplete"
                color="error"
                size="small"
              />
            </Tooltip>
          )}
        </TableCell>
        <TableCell align="right">
          <Button
            variant="outlined"
            size="small"
            startIcon={<LogoutIcon />}
            onClick={handleSignOut}
            sx={{
              borderColor: "error.main",
              color: "error.main",
              "&:hover": {
                borderColor: "error.dark",
                bgcolor: "error.main",
                color: "white",
              },
            }}
          >
            Sign Out
          </Button>
        </TableCell>
      </TableRow>
    );
  }
);

DesktopUserRow.displayName = "DesktopUserRow";

export default DesktopUserRow;