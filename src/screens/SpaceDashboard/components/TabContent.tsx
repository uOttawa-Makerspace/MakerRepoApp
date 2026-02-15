import React, { memo } from "react";
import {
  Box,
  Container,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { TabPanel } from "../../../components/TabPanel";
import Dashboard from "../../SpaceDashboardTabs/Dashboard/index";
import Search from "../../SpaceDashboardTabs/Search/index";
import NewTrainingSession from "../../SpaceDashboardTabs/NewTrainingSession/index";
import TrainingSessions from "../../SpaceDashboardTabs/TrainingSessions/index";
import Shifts from "../../SpaceDashboardTabs/Shifts/index";
import Printers from "../../SpaceDashboardTabs/Printers/index";
import LoadingErrorWrapper from "./LoadingErrorWrapper";
import { SpaceData, LoadingState, ErrorState } from "../types";

interface TabContentProps {
  tabIndex: number;
  inSpaceUsers: SpaceData | null;
  trainingSessions: any;
  printers: any;
  loading: LoadingState;
  errors: ErrorState;
  spaceId: string | number | null;
  currentUserId: number | null;
  shiftsReloadTrigger: number;
  onReloadUsers: () => void;
  onReloadSessions: () => void;
  onReloadPrinters: () => void;
}

const TabContent: React.FC<TabContentProps> = memo(
  ({
    tabIndex,
    inSpaceUsers,
    trainingSessions,
    printers,
    loading,
    errors,
    spaceId,
    currentUserId,
    shiftsReloadTrigger,
    onReloadUsers,
    onReloadSessions,
    onReloadPrinters,
  }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const tabPadding = isMobile ? 0 : 2;

    return (
      <Box sx={{ py: isMobile ? 0 : 3 }}>
        <Container maxWidth="xl" disableGutters={isMobile}>
          {/* Dashboard */}
          <TabPanel value={tabIndex} index={0}>
            <Box sx={{ px: 0 }}>
              <Dashboard
                inSpaceUsers={inSpaceUsers?.space_users ?? []}
                handleReloadCurrentUsers={onReloadUsers}
                spaceId={spaceId ?? undefined}
              />
            </Box>
          </TabPanel>

          {/* Search */}
          <TabPanel value={tabIndex} index={1}>
            <Box sx={{ px: tabPadding }}>
              <Search handleReloadCurrentUsers={onReloadUsers} />
            </Box>
          </TabPanel>

          {/* New Training Session */}
          <TabPanel value={tabIndex} index={2}>
            <Box sx={{ px: tabPadding }}>
              {errors.sessions && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errors.sessions}
                </Alert>
              )}
              <NewTrainingSession
                spaceId={spaceId}
                reloadTrainingSessions={onReloadSessions}
              />
            </Box>
          </TabPanel>

          {/* Training Sessions */}
          <TabPanel value={tabIndex} index={3}>
            <Box sx={{ px: tabPadding }}>
              <LoadingErrorWrapper
                loading={loading.sessions}
                error={errors.sessions}
                onRetry={onReloadSessions}
              >
                <TrainingSessions
                  trainingSessions={trainingSessions}
                  reloadTrainingSessions={onReloadSessions}
                />
              </LoadingErrorWrapper>
            </Box>
          </TabPanel>

          {/* Shifts */}
          <TabPanel value={tabIndex} index={4}>
            <Box sx={{ px: tabPadding }}>
              <Shifts
                reloadShifts={shiftsReloadTrigger}
                spaceId={
                  spaceId != null ? Number(spaceId) : undefined
                }
                currentUserId={currentUserId || undefined}
              />
            </Box>
          </TabPanel>

          {/* Printers */}
          <TabPanel value={tabIndex} index={5}>
            <Box sx={{ px: tabPadding }}>
              <LoadingErrorWrapper
                loading={loading.printers}
                error={errors.printers}
                onRetry={onReloadPrinters}
              >
                <Printers
                  inSpaceUsers={inSpaceUsers}
                  handleReloadCurrentUsers={onReloadUsers}
                  reloadPrinters={onReloadPrinters}
                />
              </LoadingErrorWrapper>
            </Box>
          </TabPanel>
        </Container>
      </Box>
    );
  }
);

TabContent.displayName = "TabContent";

export default TabContent;