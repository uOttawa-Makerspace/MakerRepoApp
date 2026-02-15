import React, { memo, useCallback } from "react";
import {
  Paper,
  Container,
  Box,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Typography,
} from "@mui/material";
import { a11yProps } from "../../../components/TabPanel";
import ChangeSpace from "../../../components/ChangeSpace";
import { TAB_CONFIG } from "../constants";
import { SpaceData } from "../types";

interface DesktopHeaderProps {
  tabIndex: number;
  isInitialLoading: boolean;
  usersError: string | null;
  inSpaceUsers: SpaceData | null;
  onTabChange: (index: number) => void;
  onReloadUsers: () => void;
}

const DesktopHeader: React.FC<DesktopHeaderProps> = memo(
  ({
    tabIndex,
    isInitialLoading,
    usersError,
    inSpaceUsers,
    onTabChange,
    onReloadUsers,
  }) => {
    const handleTabChange = useCallback(
      (_: React.SyntheticEvent, newValue: number) => {
        onTabChange(newValue);
      },
      [onTabChange]
    );

    return (
      <Paper
        elevation={1}
        sx={{
          borderRadius: 0,
          borderBottom: 1,
          borderColor: "divider",
          position: "sticky",
          top: 0,
          zIndex: 1100,
          bgcolor: "background.paper",
        }}
      >
        <Container maxWidth="xl" sx={{ py: 2 }}>
          {isInitialLoading ? (
            <Box display="flex" alignItems="center" gap={2}>
              <CircularProgress size={24} />
              <Typography>Loading space data...</Typography>
            </Box>
          ) : usersError ? (
            <Alert severity="error" onClose={onReloadUsers}>
              {usersError}
            </Alert>
          ) : (
            <ChangeSpace
              inSpaceUsers={inSpaceUsers}
              handleReloadCurrentUsers={onReloadUsers}
            />
          )}
        </Container>

        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label="Space dashboard tabs"
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            "& .MuiTab-root": {
              minHeight: 64,
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 500,
            },
          }}
        >
          {TAB_CONFIG.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              icon={tab.icon}
              iconPosition="start"
              {...a11yProps(index)}
            />
          ))}
        </Tabs>
      </Paper>
    );
  }
);

DesktopHeader.displayName = "DesktopHeader";

export default DesktopHeader;