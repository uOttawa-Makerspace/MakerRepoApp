import React from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Stack,
  Avatar,
  Box,
  Typography,
  Chip,
  Button,
} from "@mui/material";
import {
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Login as LoginIcon,
} from "@mui/icons-material";
import type { User } from "../types";

interface DesktopUserTableProps {
  users: User[];
  onSignInClick: (user: User) => void;
  onNavigateToProfile: (username: string) => void;
}

const DesktopUserTable = React.memo(
  ({ users, onSignInClick, onNavigateToProfile }: DesktopUserTableProps) => (
    <TableContainer component={Paper} elevation={1}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              hover
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>
                <Stack direction="row" spacing={2} alignItems="center">
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
                      fontWeight={500}
                      onClick={() => onNavigateToProfile(user.username)}
                      sx={{
                        color: "primary.main",
                        cursor: "pointer",
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
                <Chip
                  icon={user.flagged ? <WarningIcon /> : <CheckCircleIcon />}
                  label={user.flagged ? "Flagged" : "Active"}
                  color={user.flagged ? "warning" : "success"}
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<LoginIcon />}
                  onClick={() => onSignInClick(user)}
                >
                  Sign In
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
);

DesktopUserTable.displayName = "DesktopUserTable";

export default DesktopUserTable;