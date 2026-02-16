import React from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import type { User } from "../types";
import MobileUserCard from "./MobileUserCard";
import DesktopUserTable from "./DesktopUserTable";

interface SearchResultsProps {
  results: User[];
  onSignInClick: (user: User) => void;
  onNavigateToProfile: (username: string) => void;
}

const SearchResults = React.memo(
  ({ results, onSignInClick, onNavigateToProfile }: SearchResultsProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    if (results.length === 0) return null;

    return (
      <Box>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Search Results ({results.length})
        </Typography>

        {isMobile ? (
          <Box>
            {results.map((user) => (
              <MobileUserCard
                key={user.id}
                user={user}
                onSignInClick={onSignInClick}
                onNavigateToProfile={onNavigateToProfile}
              />
            ))}
          </Box>
        ) : (
          <DesktopUserTable
            users={results}
            onSignInClick={onSignInClick}
            onNavigateToProfile={onNavigateToProfile}
          />
        )}
      </Box>
    );
  }
);

SearchResults.displayName = "SearchResults";

export default SearchResults;