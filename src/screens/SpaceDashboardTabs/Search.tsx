import React, { useState, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Autocomplete,
  CircularProgress,
  Stack,
  Chip,
  Avatar,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme,
  Alert,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Warning as WarningIcon,
  Login as LoginIcon,
  Clear as ClearIcon,
  Email as EmailIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import * as HTTPRequest from "../../utils/HTTPRequests";
import { useNavigate } from "react-router-dom";
import { debounce } from "@mui/material/utils";

type SearchProps = {
  handleReloadCurrentUsers: () => void;
};

interface User {
  id: string | number;
  name: string;
  username: string;
  email: string;
  flagged: boolean;
  avatar_url?: string;
}

interface SearchUser {
  name: string;
  username: string;
}

const Search = ({ handleReloadCurrentUsers }: SearchProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  // Search State
  const [autocompleteOpen, setAutocompleteOpen] = useState(false);
  const [autocompleteOptions, setAutocompleteOptions] = useState<SearchUser[]>([]);
  const [autocompleteLoading, setAutocompleteLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SearchUser | null>(null);

  // Manual Search State
  const [manualSearchQuery, setManualSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);

  // Sign In State
  const [signInDialog, setSignInDialog] = useState<{
    open: boolean;
    user: User | SearchUser | null;
  }>({ open: false, user: null });
  const [signingIn, setSigningIn] = useState(false);

  // Debounced autocomplete search
  const fetchAutocompleteOptions = useMemo(
    () =>
      debounce(async (query: string) => {
        if (query.length < 2) {
          setAutocompleteOptions([]);
          return;
        }

        setAutocompleteLoading(true);

        try {
          const response = await HTTPRequest.get(
            `staff_dashboard/populate_users?search=${query}`
          );
          const options: SearchUser[] = response.users.map((user: SearchUser) => ({
            name: user.name,
            username: user.username,
          }));
          setAutocompleteOptions(options);
        } catch (error) {
          console.error(error);
          toast.error("Failed to search users", { position: "bottom-center" });
        } finally {
          setAutocompleteLoading(false);
        }
      }, 300),
    []
  );

  const handleAutocompleteInputChange = (
    event: React.SyntheticEvent,
    value: string
  ) => {
    fetchAutocompleteOptions(value);
  };

  const handleManualSearch = async () => {
    if (!manualSearchQuery.trim()) return;

    setSearching(true);
    try {
      const response = await HTTPRequest.get(
        `staff_dashboard/search?query=${manualSearchQuery}`
      );
      setSearchResults(response);

      if (response.length === 0) {
        toast.error("No users found", { position: "bottom-center" });
      }
    } catch (error) {
      console.error(error);
      toast.error("Search failed. Please try again.", {
        position: "bottom-center",
      });
    } finally {
      setSearching(false);
    }
  };

  const handleSignInClick = (user: User | SearchUser) => {
    setSignInDialog({ open: true, user });
  };

  const handleSignInConfirm = async () => {
    if (!signInDialog.user) return;

    setSigningIn(true);
    const username = signInDialog.user.username;

    try {
      await HTTPRequest.put(`staff_dashboard/add_users?added_users=${username}`, {});
      handleReloadCurrentUsers();
      toast.success(`${signInDialog.user.name} signed in successfully!`, {
        position: "bottom-center",
        icon: "👍",
        duration: 3000,
      });
      setSignInDialog({ open: false, user: null });

      // Clear selections
      setSelectedUser(null);
      setManualSearchQuery("");
      setSearchResults([]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to sign in user. Please try again.", {
        position: "bottom-center",
      });
    } finally {
      setSigningIn(false);
    }
  };

  const handleSignInCancel = () => {
    setSignInDialog({ open: false, user: null });
  };

  const sendToUserProfile = (username: string) => {
    navigate(`/profile/${username}`);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleManualSearch();
    }
  };

  // Mobile User Card
  const MobileUserCard = ({ user }: { user: User }) => (
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
          {/* Header */}
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
                onClick={() => sendToUserProfile(user.username)}
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

          {/* Email */}
          <Box display="flex" alignItems="center" gap={1}>
            <EmailIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary" noWrap>
              {user.email}
            </Typography>
          </Box>

          {/* Sign In Button */}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            startIcon={<LoginIcon />}
            onClick={() => handleSignInClick(user)}
            size="large"
          >
            Sign In User
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Header */}
      {!isMobile && (
        <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
          Search Users
        </Typography>
      )}

      <Stack spacing={3}>
        {/* Quick Sign In Card */}
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Quick Sign In
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Search and sign in a user quickly
            </Typography>

            <Stack spacing={2}>
              {/* Autocomplete Search */}
              <Autocomplete
                open={autocompleteOpen}
                onOpen={() => setAutocompleteOpen(true)}
                onClose={() => setAutocompleteOpen(false)}
                isOptionEqualToValue={(option, value) =>
                  option.username === value.username
                }
                getOptionLabel={(option) => option.name}
                options={autocompleteOptions}
                loading={autocompleteLoading}
                value={selectedUser}
                onChange={(event, newValue) => setSelectedUser(newValue)}
                onInputChange={handleAutocompleteInputChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search by name or username"
                    placeholder="Start typing to search..."
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <>
                          {autocompleteLoading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box display="flex" alignItems="center" gap={2} width="100%">
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {option.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography variant="body2" fontWeight={500} noWrap>
                          {option.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>
                          @{option.username}
                        </Typography>
                      </Box>
                    </Box>
                  </li>
                )}
                noOptionsText="No users found. Try a different search."
              />

              {/* Selected User Display */}
              {selectedUser && (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor: "primary.50",
                    borderColor: "primary.main",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box display="flex" alignItems="center" gap={2} flex={1}>
                      <Avatar>
                        {selectedUser.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="body1" fontWeight={600} noWrap>
                          {selectedUser.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          @{selectedUser.username}
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => setSelectedUser(null)}
                    >
                      <ClearIcon />
                    </IconButton>
                  </Stack>
                </Paper>
              )}

              {/* Sign In Button */}
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                startIcon={<LoginIcon />}
                onClick={() => selectedUser && handleSignInClick(selectedUser)}
                disabled={!selectedUser}
              >
                Sign In Selected User
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Divider */}
        <Box display="flex" alignItems="center" gap={2}>
          <Divider sx={{ flex: 1 }} />
          <Typography variant="body2" color="text.secondary">
            OR
          </Typography>
          <Divider sx={{ flex: 1 }} />
        </Box>

        {/* Advanced Search Card */}
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Advanced Search
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Search by username, name, or email
            </Typography>

            <Stack spacing={2}>
              {/* Search Input */}
              <TextField
                fullWidth
                placeholder="Enter username, name, or email"
                value={manualSearchQuery}
                onChange={(e) => setManualSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: manualSearchQuery && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setManualSearchQuery("");
                          setSearchResults([]);
                        }}
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Search Button */}
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                size="large"
                startIcon={
                  searching ? <CircularProgress size={20} /> : <SearchIcon />
                }
                onClick={handleManualSearch}
                disabled={!manualSearchQuery.trim() || searching}
              >
                {searching ? "Searching..." : "Search Users"}
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <Box>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Search Results ({searchResults.length})
            </Typography>

            {isMobile ? (
              /* Mobile Card View */
              <Box>
                {searchResults.map((user) => (
                  <MobileUserCard key={user.id} user={user} />
                ))}
              </Box>
            ) : (
              /* Desktop Table View */
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
                    {searchResults.map((user) => (
                      <TableRow
                        key={user.id}
                        hover
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
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
                                onClick={() => sendToUserProfile(user.username)}
                                sx={{
                                  color: "primary.main",
                                  cursor: "pointer",
                                  "&:hover": { textDecoration: "underline" },
                                }}
                              >
                                {user.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
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
                            <Chip
                              icon={<WarningIcon />}
                              label="Flagged"
                              color="warning"
                              size="small"
                            />
                          ) : (
                            <Chip
                              icon={<CheckCircleIcon />}
                              label="Active"
                              color="success"
                              size="small"
                            />
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            startIcon={<LoginIcon />}
                            onClick={() => handleSignInClick(user)}
                          >
                            Sign In
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}
      </Stack>

      {/* Sign In Confirmation Dialog */}
      <Dialog
        open={signInDialog.open}
        onClose={handleSignInCancel}
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
              Confirm Sign In
            </Typography>
            <IconButton onClick={handleSignInCancel}>
              <CloseIcon />
            </IconButton>
          </Box>
        )}
        {!isMobile && <DialogTitle>Confirm Sign In</DialogTitle>}
        <DialogContent sx={{ pt: isMobile ? 3 : 2 }}>
          <DialogContentText>
            Are you sure you want to sign in{" "}
            <strong>{signInDialog.user?.name}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: isMobile ? 2 : 1, gap: isMobile ? 1 : 0 }}>
          <Button
            onClick={handleSignInCancel}
            disabled={signingIn}
            fullWidth={isMobile}
            variant={isMobile ? "outlined" : "text"}
            size={isMobile ? "large" : "medium"}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSignInConfirm}
            color="primary"
            variant="contained"
            disabled={signingIn}
            fullWidth={isMobile}
            size={isMobile ? "large" : "medium"}
            autoFocus
            startIcon={signingIn ? <CircularProgress size={20} /> : <LoginIcon />}
          >
            {signingIn ? "Signing In..." : "Sign In"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Search;