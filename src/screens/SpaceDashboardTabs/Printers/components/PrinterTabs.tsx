import React, { memo } from "react";
import { Paper, Tabs, Tab } from "@mui/material";
import {
  Link as LinkIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { a11yProps } from "../../../../components/TabPanel";

interface PrinterTabsProps {
  tabIndex: number;
  issueCount: number;
  isMobile: boolean;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const PrinterTabs = memo<PrinterTabsProps>(
  ({ tabIndex, issueCount, isMobile, onChange }) => (
    <Paper elevation={1} sx={{ mb: 2 }}>
      <Tabs
        value={tabIndex}
        onChange={onChange}
        variant={isMobile ? "fullWidth" : "standard"}
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Tab
          label="Link Printers"
          icon={<LinkIcon />}
          iconPosition="start"
          {...a11yProps(0)}
        />
        <Tab
          label={issueCount > 0 ? `Issues (${issueCount})` : "Issues"}
          icon={<WarningIcon />}
          iconPosition="start"
          {...a11yProps(1)}
        />
      </Tabs>
    </Paper>
  )
);

PrinterTabs.displayName = "PrinterTabs";
export default PrinterTabs;