import React from "react";
import {
  Card,
  CardContent,
  Stack,
  Box,
  Typography,
  Chip,
  Divider,
  Button,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  School as SchoolIcon,
  Group as GroupIcon,
} from "@mui/icons-material";
import type { TrainingSession } from "../types";
import { formatDate, isSessionCompleted } from "../utils/utils";

interface MobileSessionCardProps {
  session: TrainingSession;
  onCertifyClick: (session: TrainingSession) => void;
  onSessionClick: (session: TrainingSession) => void;
}

const DetailRow = React.memo(
  ({ icon, text }: { icon: React.ReactNode; text: string }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {icon}
      <Typography variant="body2" color="text.secondary">
        {text}
      </Typography>
    </Box>
  )
);
DetailRow.displayName = "DetailRow";

const MobileSessionCard = React.memo(
  ({ session, onCertifyClick, onSessionClick }: MobileSessionCardProps) => {
    const completed = isSessionCompleted(session);
    const userCount = session.users?.length ?? 0;

    return (
      <Card
        onClick={() => onSessionClick(session)}
        sx={{
          mb: 2,
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
          cursor: "pointer",
          transition: "box-shadow 0.2s, border-color 0.2s",
          "&:hover": {
            borderColor: "primary.main",
            boxShadow: 2,
          },
          "&:active": {
            boxShadow: 1,
          },
        }}
      >
        <CardContent>
          <Stack spacing={2}>
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
              }}
            >
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom noWrap>
                  {session.training.name_en}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Chip
                    label={completed ? "Completed" : "Pending"}
                    color={completed ? "success" : "warning"}
                    size="small"
                    icon={completed ? <CheckCircleIcon /> : <ScheduleIcon />}
                  />
                  {userCount > 0 && (
                    <Chip
                      icon={<GroupIcon />}
                      label={`${userCount} user${userCount !== 1 ? "s" : ""}`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>
              </Box>
            </Box>

            <Divider />

            {/* Details */}
            <Stack spacing={1}>
              <DetailRow
                icon={<CalendarIcon fontSize="small" color="action" />}
                text={formatDate(session.updated_at)}
              />
              <DetailRow
                icon={<LocationIcon fontSize="small" color="action" />}
                text={session.space?.name ?? "N/A"}
              />
              <DetailRow
                icon={<SchoolIcon fontSize="small" color="action" />}
                text={session.course ?? "N/A"}
              />
            </Stack>

            {/* Action */}
            {!completed && (
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  onCertifyClick(session);
                }}
                startIcon={<CheckCircleIcon />}
                sx={{ mt: 1 }}
              >
                Certify Trainees
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
    );
  }
);

MobileSessionCard.displayName = "MobileSessionCard";

export default MobileSessionCard;