import React, { memo } from "react";
import { Paper, Tabs, Tab, useMediaQuery, useTheme } from "@mui/material";
import {
  Person as PersonIcon,
  School as SchoolIcon,
  Badge as BadgeIcon,
  CreditCard as CreditCardIcon,
  AdminPanelSettings as AdminIcon,
} from "@mui/icons-material";
import { a11yProps } from "../../../components/TabPanel";

interface ProfileTabsProps {
  tabIndex: number;
  onTabChange: (newValue: number) => void;
  certCount: number;
  isAdmin: boolean;
}

const ProfileTabs: React.FC<ProfileTabsProps> = memo(
  ({ tabIndex, onTabChange, certCount, isAdmin }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    return (
      <Paper elevation={1} sx={{ mb: 2 }}>
        <Tabs
          value={tabIndex}
          onChange={(_, newValue) => onTabChange(newValue)}
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab
            label="About"
            icon={<PersonIcon />}
            iconPosition="start"
            {...a11yProps(0)}
          />
          <Tab
            label="Programs"
            icon={<SchoolIcon />}
            iconPosition="start"
            {...a11yProps(1)}
          />
          <Tab
            label={`Certifications (${certCount})`}
            icon={<BadgeIcon />}
            iconPosition="start"
            {...a11yProps(2)}
          />
          {isAdmin && (
            <Tab
              label="Role"
              icon={<AdminIcon />}
              iconPosition="start"
              {...a11yProps(3)}
            />
          )}
          <Tab
            label="RFID"
            icon={<CreditCardIcon />}
            iconPosition="start"
            {...a11yProps(isAdmin ? 4 : 3)}
          />
        </Tabs>
      </Paper>
    );
  }
);

ProfileTabs.displayName = "ProfileTabs";

export default ProfileTabs;