import React, { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Tooltip,
  Stack,
  TableSortLabel,
  Card,
  CardContent,
  CardActions,
  Divider,
  useMediaQuery,
  useTheme,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import {
  Search as SearchIcon,
  Logout as LogoutIcon,
  Warning as WarningIcon,
  Person as PersonIcon,
  Clear as ClearIcon,
  Email as EmailIcon,
  Close as CloseIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import * as HTTPRequest from "../../utils/HTTPRequests";
import Rfid from "../../components/Rfid";

interface User {
  id: number | string;
  username: string;
  name: string;
  email: string;
  flagged: boolean;
  avatar_url?: string;
}

type DashboardProps = {
  inSpaceUsers: User[];
  handleReloadCurrentUsers: () => void;
  spaceId: string | number | undefined;
};

type SortField = "name" | "email" | "flagged";
type SortOrder = "asc" | "desc";

const Dashboard = ({
  inSpaceUsers,
  handleReloadCurrentUsers,
  spaceId,
}: DashboardProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [signOutDialog, setSignOutDialog] = useState<{
    open: boolean;
    user: User | null;
  }>({ open: false, user: null });
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [signingOut, setSigningOut] = useState(false);

  const sendToUserProfile = (username: string) => {
    navigate(`/profile/${username}`);
  };

  const handleSignOutClick = (user: User) => {
    setSignOutDialog({ open: true, user });
  };

  const handleSignOutConfirm = async () => {
    if (!signOutDialog.user) return;

    setSigningOut(true);
    const username = signOutDialog.user.username;

    try {
      await HTTPRequest.put(
        `staff_dashboard/remove_users?dropped_users[]=${username}`,
        {}
      );
      handleReloadCurrentUsers();
      toast.success(`${signOutDialog.user.name} has been signed out`, {
        position: "bottom-center",
        icon: "👋",
      });
      setSignOutDialog({ open: false, user: null });
    } catch (error) {
      console.error(error);
      toast.error("Failed to sign out user. Please try again.", {
        position: "bottom-center",
      });
    } finally {
      setSigningOut(false);
    }
  };

  const handleSignOutCancel = () => {
    setSignOutDialog({ open: false, user: null });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Filter and sort users
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = inSpaceUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      let comparison = 0;

      if (sortField === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === "email") {
        comparison = a.email.localeCompare(b.email);
      } else if (sortField === "flagged") {
        comparison = a.flagged === b.flagged ? 0 : a.flagged ? -1 : 1;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [inSpaceUsers, searchQuery, sortField, sortOrder]);

  // Mobile List Item
  const MobileUserListItem = ({ user }: { user: User }) => (
    <Paper
      elevation={0}
      sx={{
        mb: 1,
        border: 1,
        borderColor: user.flagged ? "warning.main" : "divider",
        borderRadius: 2,
        overflow: "hidden",
        '&:hover': {
          borderColor: user.flagged ? "warning.dark" : "primary.light",
          boxShadow: 1,
        },
        transition: 'all 0.2s ease',
      }}
    >
      <ListItem
        disablePadding
        secondaryAction={
          <IconButton
            edge="end"
            onClick={() => handleSignOutClick(user)}
            sx={{ 
              mr: 1,
              color: 'error.main',
              '&:hover': {
                bgcolor: 'error.light',
                color: 'white',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <LogoutIcon />
          </IconButton>
        }
      >
        <ListItemButton onClick={() => sendToUserProfile(user.username)}>
          <ListItemAvatar>
            <Avatar src={user.avatar_url} alt={user.name} sx={{ width: 48, height: 48 }}>
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
              <Typography variant="body2" color="text.secondary" noWrap>
                {user.email}
              </Typography>
            }
          />
        </ListItemButton>
      </ListItem>
    </Paper>
  );

  return (
    <Box>
      <Box sx={{ px: isMobile ? 2 : 0, py: isMobile ? 2 : 0 }}>
        <Rfid spaceId={spaceId} />
      </Box>

      {/* Search Bar */}
      <Box sx={{ px: isMobile ? 2 : 0, mb: 2 }}>
        <TextField
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size={isMobile ? "medium" : "small"}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchQuery("")}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Empty State */}
      {inSpaceUsers.length === 0 ? (
        <Paper
          sx={{
            mx: isMobile ? 2 : 0,
            p: isMobile ? 4 : 8,
            textAlign: "center",
            bgcolor: "background.default",
          }}
        >
          <PersonIcon
            sx={{
              fontSize: isMobile ? 48 : 64,
              color: "text.secondary",
              mb: 2,
            }}
          />
          <Typography
            variant={isMobile ? "subtitle1" : "h6"}
            color="text.secondary"
            gutterBottom
          >
            No users signed in
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Users will appear here when they sign in
          </Typography>
        </Paper>
      ) : filteredAndSortedUsers.length === 0 ? (
        <Alert severity="info" sx={{ mx: isMobile ? 2 : 0 }}>
          No users match your search "{searchQuery}"
        </Alert>
      ) : isMobile ? (
        /* Mobile List View */
        <Box sx={{ px: 2 }}>
          {filteredAndSortedUsers.map((user) => (
            <MobileUserListItem key={user.id} user={user} />
          ))}
        </Box>
      ) : (
        /* Desktop Table View */
        <TableContainer component={Paper} elevation={1}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={sortField === "name"}
                    direction={sortField === "name" ? sortOrder : "asc"}
                    onClick={() => handleSort("name")}
                  >
                    User
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === "email"}
                    direction={sortField === "email" ? sortOrder : "asc"}
                    onClick={() => handleSort("email")}
                  >
                    Email
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === "flagged"}
                    direction={sortField === "flagged" ? sortOrder : "asc"}
                    onClick={() => handleSort("flagged")}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAndSortedUsers.map((user) => (
                <TableRow
                  key={user.id}
                  hover
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    cursor: "pointer",
                  }}
                >
                  <TableCell onClick={() => sendToUserProfile(user.username)}>
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
                          sx={{
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
                    {user.flagged ? (
                      <Tooltip title="This user has been flagged">
                        <Chip
                          icon={<WarningIcon />}
                          label="Flagged"
                          color="warning"
                          size="small"
                        />
                      </Tooltip>
                    ) : (
                      <Chip label="Active" color="success" size="small" />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<LogoutIcon />}
                      onClick={() => handleSignOutClick(user)}
                      sx={{
                        borderColor: 'error.main',
                        color: 'error.main',
                        '&:hover': {
                          borderColor: 'error.dark',
                          bgcolor: 'error.main',
                          color: 'white',
                        },
                      }}
                    >
                      Sign Out
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Sign Out Confirmation Dialog */}
      <Dialog
        open={signOutDialog.open}
        onClose={handleSignOutCancel}
        maxWidth="xs"
        fullWidth
        fullScreen={isMobile}
      >
        {isMobile && (
          <Box
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              Confirm Sign Out
            </Typography>
            <IconButton onClick={handleSignOutCancel}>
              <CloseIcon />
            </IconButton>
          </Box>
        )}
        {!isMobile && <DialogTitle>Confirm Sign Out</DialogTitle>}
        <DialogContent sx={{ pt: isMobile ? 3 : 2 }}>
          <DialogContentText>
            Are you sure you want to sign out{" "}
            <strong>{signOutDialog.user?.name}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: isMobile ? 2 : 1, gap: isMobile ? 1 : 0 }}>
          <Button
            onClick={handleSignOutCancel}
            disabled={signingOut}
            fullWidth={isMobile}
            variant={isMobile ? "outlined" : "text"}
            size={isMobile ? "large" : "medium"}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSignOutConfirm}
            color="error"
            variant="contained"
            disabled={signingOut}
            fullWidth={isMobile}
            size={isMobile ? "large" : "medium"}
            autoFocus
          >
            {signingOut ? "Signing Out..." : "Sign Out"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;