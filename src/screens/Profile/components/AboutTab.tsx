import React, { memo } from "react";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Stack,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { TabPanel } from "../../../components/TabPanel";
import InfoRow from "./InfoRow";
import { User } from "../types";

interface AboutTabProps {
  tabIndex: number;
  user: User;
}

const AboutTab: React.FC<AboutTabProps> = memo(({ tabIndex, user }) => (
  <TabPanel value={tabIndex} index={0}>
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Personal Information
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack spacing={2}>
          <InfoRow
            icon={<PersonIcon />}
            label="Username"
            value={user.username}
          />
          <InfoRow
            icon={<EmailIcon />}
            label="Email"
            value={user.email}
          />
          <InfoRow
            icon={<SchoolIcon />}
            label="Faculty"
            value={user.faculty}
          />
          <InfoRow
            icon={<SchoolIcon />}
            label="Program"
            value={user.program}
          />
          <InfoRow
            icon={<CalendarIcon />}
            label="Year of Study"
            value={user.year_of_study}
          />
          <InfoRow
            icon={<PersonIcon />}
            label="Identity"
            value={user.identity}
          />
        </Stack>
      </CardContent>
    </Card>
  </TabPanel>
));

AboutTab.displayName = "AboutTab";

export default AboutTab;