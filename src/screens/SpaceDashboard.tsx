import React, { useEffect, useState, useCallback } from "react";
import {
  Tab,
  Tabs,
  Box,
  Container,
  Alert,
  CircularProgress,
  Paper,
  useMediaQuery,
  useTheme,
  Drawer,
  IconButton,
  Typography,
  Fade,
  Chip,
  Stack,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Search as SearchIcon,
  Add as AddIcon,
  School as SchoolIcon,
  Schedule as ScheduleIcon,
  Print as PrintIcon,
  SwapHoriz as SwapIcon,
  Close as CloseIcon,
  MoreVert as MoreVertIcon,
  KeyboardArrowDown as ArrowDownIcon,
} from "@mui/icons-material";
import * as HTTPRequest from "../utils/HTTPRequests";
import { a11yProps, TabPanel } from "../components/TabPanel";
import "react-bootstrap-typeahead/css/Typeahead.css";
import Dashboard from "./SpaceDashboardTabs/Dashboard";
import Search from "./SpaceDashboardTabs/Search";
import NewTrainingSession from "./SpaceDashboardTabs/NewTrainingSession";
import TrainingSessions from "./SpaceDashboardTabs/TrainingSessions";
import ChangeSpace from "../components/ChangeSpace";
import Shifts from "./SpaceDashboardTabs/Shifts";
import Printers from "./SpaceDashboardTabs/Printers";
import { Toaster } from 'react-hot-toast';

interface SpaceData {
  space_users: any[];
  space: {
    id: string | number;
    name?: string;
  };
  current_user?: {
    id: number;
    name?: string;
  };
}

interface LoadingState {
  users: boolean;
  sessions: boolean;
  printers: boolean;
}

interface ErrorState {
  users: string | null;
  sessions: string | null;
  printers: string | null;
}

const TAB_CONFIG = [
  { label: "Dashboard", icon: <DashboardIcon />, color: "primary" },
  { label: "Search", icon: <SearchIcon />, color: "secondary" },
  { label: "New Session", icon: <AddIcon />, color: "success" },
  { label: "Sessions", icon: <SchoolIcon />, color: "info" },
  { label: "Shifts", icon: <ScheduleIcon />, color: "warning" },
  { label: "Printers", icon: <PrintIcon />, color: "error" },
];

function SpaceDashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [inSpaceUsers, setInSpaceUsers] = useState<SpaceData | null>(null);
  const [trainingSessions, setTrainingSessions] = useState<any>(null);
  const [printers, setPrinters] = useState<any>(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [spaceDrawerOpen, setSpaceDrawerOpen] = useState(false);
  const [tabMenuAnchor, setTabMenuAnchor] = useState<null | HTMLElement>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [shiftsReloadTrigger, setShiftsReloadTrigger] = useState(0);

  // Track which tabs have been visited
  const [visitedTabs, setVisitedTabs] = useState<Set<number>>(new Set([0]));

  const [loading, setLoading] = useState<LoadingState>({
    users: true,
    sessions: false,
    printers: false,
  });

  const [errors, setErrors] = useState<ErrorState>({
    users: null,
    sessions: null,
    printers: null,
  });

  const handleTabChange = (newValue: number) => {
    setTabIndex(newValue);
    setTabMenuAnchor(null);
    
    // Mark tab as visited
    setVisitedTabs((prev) => new Set(prev).add(newValue));
  };

  const getCurrentUsers = useCallback(async () => {
    setLoading((prev) => ({ ...prev, users: true }));
    setErrors((prev) => ({ ...prev, users: null }));

    try {
      const response = await HTTPRequest.get("staff_dashboard");
      setInSpaceUsers(response);
      
      // Extract current user ID
      if (response.current_user?.id) {
        setCurrentUserId(response.current_user.id);
      }
    } catch (error) {
      console.error(error);
      setErrors((prev) => ({ ...prev, users: "Failed to load users" }));
    } finally {
      setLoading((prev) => ({ ...prev, users: false }));
    }
  }, []);

  const getTrainingSessions = useCallback(async () => {
    setLoading((prev) => ({ ...prev, sessions: true }));
    setErrors((prev) => ({ ...prev, sessions: null }));

    try {
      const response = await HTTPRequest.get("staff/training_sessions");
      setTrainingSessions(response);
    } catch (error) {
      console.error(error);
      setErrors((prev) => ({
        ...prev,
        sessions: "Failed to load training sessions",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, sessions: false }));
    }
  }, []);

  const getPrinterData = useCallback(async () => {
    setLoading((prev) => ({ ...prev, printers: true }));
    setErrors((prev) => ({ ...prev, printers: null }));

    try {
      const response = await HTTPRequest.get("printers");
      setPrinters(response);
    } catch (error) {
      console.error(error);
      setErrors((prev) => ({ ...prev, printers: "Failed to load printers" }));
    } finally {
      setLoading((prev) => ({ ...prev, printers: false }));
    }
  }, []);

  // Trigger shift reload
  const handleReloadShifts = useCallback(() => {
    setShiftsReloadTrigger((prev) => prev + 1);
  }, []);

  // Only load users on mount
  useEffect(() => {
    getCurrentUsers();
  }, [getCurrentUsers]);

  // Load training sessions when tabs 2 (New Session) or 3 (Sessions) are visited
  useEffect(() => {
    if ((visitedTabs.has(2) || visitedTabs.has(3)) && !trainingSessions && !loading.sessions) {
      getTrainingSessions();
    }
  }, [visitedTabs, trainingSessions, loading.sessions, getTrainingSessions]);

  // Load printers when tab 5 (Printers) is visited
  useEffect(() => {
    if (visitedTabs.has(5) && !printers && !loading.printers) {
      getPrinterData();
    }
  }, [visitedTabs, printers, loading.printers, getPrinterData]);

  // Reload shifts when space changes
  useEffect(() => {
    if (inSpaceUsers?.space?.id && visitedTabs.has(4)) {
      handleReloadShifts();
    }
  }, [inSpaceUsers?.space?.id, visitedTabs, handleReloadShifts]);

  const isInitialLoading = loading.users && !inSpaceUsers;
  const userCount = inSpaceUsers?.space_users?.length || 0;
  const flaggedCount =
    inSpaceUsers?.space_users?.filter((u: any) => u.flagged)?.length || 0;

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "background.default",
        minHeight: "100vh",
        pb: isMobile ? 7 : 0,
      }}
    >
      {/* Mobile Header */}
      {isMobile ? (
        <Paper
          elevation={0}
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1100,
            bgcolor: "background.paper",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          {/* Space Info Bar */}
          <Box sx={{ px: 2, pt: 2, pb: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography variant="h6" fontWeight={700} noWrap>
                  {inSpaceUsers?.space?.name || "Loading..."}
                </Typography>
              </Box>
              <IconButton
                onClick={() => setSpaceDrawerOpen(true)}
                size="small"
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  width: 36,
                  height: 36,
                  '&:hover': { 
                    bgcolor: 'primary.dark',
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <SwapIcon fontSize="small" />
              </IconButton>
            </Stack>

            {!isInitialLoading && (
              <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                <Chip
                  label={`${userCount} user${userCount !== 1 ? "s" : ""}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                {flaggedCount > 0 && (
                  <Chip
                    label={`${flaggedCount} flagged`}
                    size="small"
                    color="warning"
                    variant="outlined"
                  />
                )}
              </Stack>
            )}
          </Box>

          {/* Tab Selector Button */}
          <Box sx={{ px: 2, pb: 1.5 }}>
            <Button
              fullWidth
              variant="outlined"
              endIcon={<ArrowDownIcon />}
              onClick={(e) => setTabMenuAnchor(e.currentTarget)}
              sx={{
                justifyContent: 'space-between',
                py: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.dark',
                  bgcolor: 'primary.light',
                  color: 'white',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {TAB_CONFIG[tabIndex].icon}
                {TAB_CONFIG[tabIndex].label}
              </Box>
            </Button>

            {/* Tab Menu */}
            <Menu
              anchorEl={tabMenuAnchor}
              open={Boolean(tabMenuAnchor)}
              onClose={() => setTabMenuAnchor(null)}
              PaperProps={{
                sx: { width: "90vw", maxWidth: 400 },
              }}
            >
              {TAB_CONFIG.map((tab, index) => (
                <MenuItem
                  key={index}
                  selected={tabIndex === index}
                  onClick={() => handleTabChange(index)}
                  sx={{ py: 1.5 }}
                >
                  <ListItemIcon>{tab.icon}</ListItemIcon>
                  <ListItemText
                    primary={tab.label}
                    primaryTypographyProps={{
                      fontWeight: tabIndex === index ? 600 : 400,
                    }}
                  />
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Paper>
      ) : (
        /* Desktop Header */
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
            ) : errors.users ? (
              <Alert severity="error" onClose={() => getCurrentUsers()}>
                {errors.users}
              </Alert>
            ) : (
              <ChangeSpace
                inSpaceUsers={inSpaceUsers}
                handleReloadCurrentUsers={getCurrentUsers}
              />
            )}
          </Container>

          {/* Desktop Tabs */}
          <Tabs
            value={tabIndex}
            onChange={(e, newValue) => handleTabChange(newValue)}
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
      )}

      {/* Tab Content */}
      <Box
        sx={{
          py: isMobile ? 0 : 3,
        }}
      >
        <Container
          maxWidth="xl"
          disableGutters={isMobile}
        >
          {/* Dashboard Tab */}
          <TabPanel value={tabIndex} index={0}>
            <Box sx={{ px: isMobile ? 0 : 0 }}>
              <Dashboard
                inSpaceUsers={inSpaceUsers?.space_users ?? []}
                handleReloadCurrentUsers={getCurrentUsers}
                spaceId={inSpaceUsers?.space?.id}
              />
            </Box>
          </TabPanel>

          {/* Search Tab */}
          <TabPanel value={tabIndex} index={1}>
            <Box sx={{ px: isMobile ? 0 : 2 }}>
              <Search handleReloadCurrentUsers={getCurrentUsers} />
            </Box>
          </TabPanel>

          {/* New Training Session Tab */}
          <TabPanel value={tabIndex} index={2}>
            <Box sx={{ px: isMobile ? 0 : 2 }}>
              {errors.sessions && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errors.sessions}
                </Alert>
              )}
              <NewTrainingSession
                spaceId={inSpaceUsers?.space?.id ?? null}
                reloadTrainingSessions={getTrainingSessions}
              />
            </Box>
          </TabPanel>

          {/* Training Sessions Tab */}
          <TabPanel value={tabIndex} index={3}>
            <Box sx={{ px: isMobile ? 0 : 2 }}>
              {loading.sessions ? (
                <Box display="flex" justifyContent="center" py={8}>
                  <CircularProgress />
                </Box>
              ) : errors.sessions ? (
                <Alert severity="error" onClose={getTrainingSessions}>
                  {errors.sessions}
                </Alert>
              ) : (
                <TrainingSessions
                  trainingSessions={trainingSessions}
                  reloadTrainingSessions={getTrainingSessions}
                />
              )}
            </Box>
          </TabPanel>

          {/* Shifts Tab */}
          <TabPanel value={tabIndex} index={4}>
            <Box sx={{ px: isMobile ? 0 : 2 }}>
              <Shifts 
                reloadShifts={shiftsReloadTrigger}
                spaceId={inSpaceUsers?.space?.id ? Number(inSpaceUsers.space.id) : undefined}
                currentUserId={currentUserId || undefined}
              />
            </Box>
          </TabPanel>

          {/* Printers Tab */}
          <TabPanel value={tabIndex} index={5}>
            <Box sx={{ px: isMobile ? 0 : 2 }}>
              {loading.printers ? (
                <Box display="flex" justifyContent="center" py={8}>
                  <CircularProgress />
                </Box>
              ) : errors.printers ? (
                <Alert severity="error" onClose={getPrinterData}>
                  {errors.printers}
                </Alert>
              ) : (
                <Printers
                  inSpaceUsers={inSpaceUsers}
                  handleReloadCurrentUsers={getCurrentUsers}
                  reloadPrinters={getPrinterData}
                />
              )}
            </Box>
          </TabPanel>
        </Container>
      </Box>

      {/* Space Change Drawer */}
      <Drawer
        anchor="right"
        open={spaceDrawerOpen}
        onClose={() => setSpaceDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 400 },
            maxWidth: "100vw",
          },
        }}
      >
        <Box>
          <Box
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              bgcolor: "primary.main",
              color: "primary.contrastText",
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              Change Space
            </Typography>
            <IconButton
              onClick={() => setSpaceDrawerOpen(false)}
              sx={{ color: "inherit" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ p: 2 }}>
            {isInitialLoading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : errors.users ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errors.users}
              </Alert>
            ) : (
              <ChangeSpace
                inSpaceUsers={inSpaceUsers}
                handleReloadCurrentUsers={() => {
                  getCurrentUsers();
                  setSpaceDrawerOpen(false);
                }}
              />
            )}
          </Box>
        </Box>
      </Drawer>
      <Toaster 
        position={isMobile ? "top-center" : "bottom-right"}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#ff6f00',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#d32f2f',
              secondary: '#fff',
            },
          },
        }}
      />
    </Box>
  );
}

export default SpaceDashboard;