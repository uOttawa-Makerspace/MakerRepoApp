import React, { useState, useCallback } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";

import { useSpaceDashboard } from "./hooks/useSpaceDashboard";

import MobileHeader from "./components/MobileHeader";
import DesktopHeader from "./components/DesktopHeader";
import TabContent from "./components/TabContent";
import SpaceDrawer from "./components/SpaceDrawer";
import DashboardToaster from "./components/DashboardToaster";

const SpaceDashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [spaceDrawerOpen, setSpaceDrawerOpen] = useState(false);

  const openDrawer = useCallback(() => setSpaceDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setSpaceDrawerOpen(false), []);

  const {
    inSpaceUsers,
    trainingSessions,
    printers,
    tabIndex,
    currentUserId,
    shiftsReloadTrigger,
    loading,
    errors,
    isInitialLoading,
    userCount,
    flaggedCount,
    spaceId,
    spaceName,
    handleTabChange,
    getCurrentUsers,
    getTrainingSessions,
    getPrinterData,
  } = useSpaceDashboard();

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "background.default",
        minHeight: "100vh",
        pb: isMobile ? 7 : 0,
      }}
    >
      {/* Header */}
      {isMobile ? (
        <MobileHeader
          spaceName={spaceName}
          userCount={userCount}
          flaggedCount={flaggedCount}
          isInitialLoading={isInitialLoading}
          tabIndex={tabIndex}
          onTabChange={handleTabChange}
          onOpenDrawer={openDrawer}
        />
      ) : (
        <DesktopHeader
          tabIndex={tabIndex}
          isInitialLoading={isInitialLoading}
          usersError={errors.users}
          inSpaceUsers={inSpaceUsers}
          onTabChange={handleTabChange}
          onReloadUsers={getCurrentUsers}
        />
      )}

      {/* Tab Content */}
      <TabContent
        tabIndex={tabIndex}
        inSpaceUsers={inSpaceUsers}
        trainingSessions={trainingSessions}
        printers={printers}
        loading={loading}
        errors={errors}
        spaceId={spaceId}
        currentUserId={currentUserId}
        shiftsReloadTrigger={shiftsReloadTrigger}
        onReloadUsers={getCurrentUsers}
        onReloadSessions={getTrainingSessions}
        onReloadPrinters={getPrinterData}
      />

      {/* Space Change Drawer (Mobile) */}
      <SpaceDrawer
        open={spaceDrawerOpen}
        isInitialLoading={isInitialLoading}
        usersError={errors.users}
        inSpaceUsers={inSpaceUsers}
        onClose={closeDrawer}
        onReloadUsers={getCurrentUsers}
      />

      <DashboardToaster />
    </Box>
  );
};

export default SpaceDashboard;