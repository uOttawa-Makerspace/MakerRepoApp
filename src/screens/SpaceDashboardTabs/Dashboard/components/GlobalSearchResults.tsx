import React, { memo } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button,
  CircularProgress,
  Paper,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Login as LoginIcon,
  SearchOff as SearchOffIcon,
} from "@mui/icons-material";
import { User } from "../types";

interface GlobalSearchResultsProps {
  results: User[];
  loading: boolean;
  searchQuery: string;
  onSignIn: (user: User) => void;
  onNavigate: (username: string) => void;
}

const GlobalSearchResults: React.FC<GlobalSearchResultsProps> = memo(
  ({ results, loading, searchQuery, onSignIn, onNavigate }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    if (!searchQuery || searchQuery.trim().length < 2) return null;

    return (
      <Box sx={{ mt: 3, px: isMobile ? 2 : 0 }}>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
          Not currently signed in
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress size={28} />
          </Box>
        ) : results.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 3 }}>
            <SearchOffIcon
              sx={{ fontSize: 40, color: "text.secondary", mb: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              No other users found matching &ldquo;{searchQuery}&rdquo;
            </Typography>
          </Box>
        ) : (
          <Paper variant="outlined">
            <List disablePadding>
              {results.map((user, index) => (
                <React.Fragment key={user.username}>
                  {index > 0 && <Divider component="li" />}
                  <ListItem
                    sx={{
                      cursor: "pointer",
                      "&:hover": { bgcolor: "action.hover" },
                      pr: isMobile ? "130px" : "140px",
                    }}
                    onClick={() => onNavigate(user.username)}
                    secondaryAction={
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={isMobile ? undefined : <LoginIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSignIn(user);
                        }}
                        sx={{ whiteSpace: "nowrap" }}
                      >
                        Sign In
                      </Button>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar src={user.avatar_url} alt={user.name}>
                        {user.name.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={user.name}
                      secondary={
                        <>
                          @{user.username}
                          {user.email && (
                            <>
                              {" · "}
                              {user.email}
                            </>
                          )}
                        </>
                      }
                      slotProps={{
                        primary: {
                          sx: { fontWeight: 500 },
                          noWrap: true,
                        },
                        secondary: {
                          noWrap: true,
                        },
                      }}
                      sx={{ minWidth: 0 }}
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </Paper>
        )}
      </Box>
    );
  }
);

GlobalSearchResults.displayName = "GlobalSearchResults";

export default GlobalSearchResults;