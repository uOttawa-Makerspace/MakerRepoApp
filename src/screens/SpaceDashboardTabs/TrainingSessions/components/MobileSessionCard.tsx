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
} from "@mui/icons-material";
import type { TrainingSession } from "../types";
import { formatDate, isSessionCompleted } from "../utils/utils";

interface MobileSessionCardProps {
  session: TrainingSession;
  onCertifyClick: (session: TrainingSession) => void;
}

const DetailRow = React.memo(
  ({
    icon,
    text,
  }: {
    icon: React.ReactNode;
    text: string;
  }) => (
    <Box display="flex" alignItems="center" gap={1}>
      {icon}
      <Typography variant="body2" color="text.secondary">
        {text}
      </Typography>
    </Box>
  )
);
DetailRow.displayName = "DetailRow";

const MobileSessionCard = React.memo(
  ({ session, onCertifyClick }: MobileSessionCardProps) => {
    const completed = isSessionCompleted(session);

    return (
      <Card
        sx={{
          mb: 2,
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Stack spacing={2}>
            {/* Header */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="start"
            >
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom noWrap>
                  {session.training.name}
                </Typography>
                <Chip
                  label={completed ? "Completed" : "Pending"}
                  color={completed ? "success" : "warning"}
                  size="small"
                  icon={completed ? <CheckCircleIcon /> : <ScheduleIcon />}
                />
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
                text={session.space.name}
              />
              <DetailRow
                icon={<SchoolIcon fontSize="small" color="action" />}
                text={session.course}
              />
            </Stack>

            {/* Action */}
            {!completed && (
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => onCertifyClick(session)}
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