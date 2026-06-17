import React, { memo } from "react";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Stack,
  Box,
  Paper,
  Avatar,
  Chip,
} from "@mui/material";
import {
  Badge as BadgeIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { TabPanel } from "../../../components/TabPanel";
import { Certification } from "../types";
import { formatDate } from "../utils";

interface CertificationsTabProps {
  tabIndex: number;
  certifications: Certification[];
}

const CertificationItem: React.FC<{ cert: Certification }> = memo(
  ({ cert }) => (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ bgcolor: "success.main" }}>
            <CheckCircleIcon />
          </Avatar>
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {cert.training.name_en}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Certified on {formatDate(cert.updated_at)}
            </Typography>
          </Box>
        </Box>
        <Chip
          label="Certified"
          color="success"
          size="small"
          icon={<CheckCircleIcon />}
        />
      </Stack>
    </Paper>
  )
);

CertificationItem.displayName = "CertificationItem";

const EmptyState: React.FC = memo(() => (
  <Box sx={{ textAlign: "center", py: 4 }}>
    <BadgeIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
    <Typography color="text.secondary">No certifications yet</Typography>
  </Box>
));

EmptyState.displayName = "EmptyState";

const CertificationsTab: React.FC<CertificationsTabProps> = memo(
  ({ tabIndex, certifications }) => (
    <TabPanel value={tabIndex} index={2}>
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom>
            Certifications
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {certifications.length === 0 ? (
            <EmptyState />
          ) : (
            <Stack spacing={2}>
              {certifications.map((cert) => (
                <CertificationItem key={cert.id} cert={cert} />
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>
    </TabPanel>
  )
);

CertificationsTab.displayName = "CertificationsTab";

export default CertificationsTab;