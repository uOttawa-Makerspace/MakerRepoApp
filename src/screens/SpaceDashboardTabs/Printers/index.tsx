import React from "react";
import {
  Box,
  Typography,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { TabPanel } from "../../../components/TabPanel";
import { usePrinters } from "./hooks/usePrinters";
import PrinterStatsGrid from "./components/PrinterStatsGrid";
import PrinterTabs from "./components/PrinterTabs";
import LinkPrintersTab from "./components/LinkPrintersTab";
import PrinterIssues from "../PrinterIssues/index";
import type { PrintersProps } from "./types";

const Printers: React.FC<PrintersProps> = ({
  inSpaceUsers,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const {
    printers,
    printerIssues,
    loading,
    tabIndex,
    users,
    stats,
    handleTabChange,
    handleReload,
  } = usePrinters(inSpaceUsers);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {!isMobile && (
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Printer Management
        </Typography>
      )}

      <PrinterStatsGrid stats={stats} />

      <PrinterTabs
        tabIndex={tabIndex}
        issueCount={stats.issues}
        isMobile={isMobile}
        onChange={handleTabChange}
      />

      <TabPanel value={tabIndex} index={0}>
        <LinkPrintersTab
          printers={printers}
          users={users}
          onLink={handleReload}
        />
      </TabPanel>

      <TabPanel value={tabIndex} index={1}>
        <PrinterIssues issues={printerIssues} />
      </TabPanel>
    </Box>
  );
};

export default Printers;