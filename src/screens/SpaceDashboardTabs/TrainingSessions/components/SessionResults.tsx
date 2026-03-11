import React from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import type { TrainingSession, SortField, SortOrder } from "../types";
import MobileSessionCard from "./MobileSessionCard";
import DesktopSessionTable from "./DesktopSessionTable";

interface SessionResultsProps {
  sessions: TrainingSession[];
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  onCertifyClick: (session: TrainingSession) => void;
  onSessionClick: (session: TrainingSession) => void;
}

const SessionResults = React.memo(
  ({
    sessions,
    sortField,
    sortOrder,
    onSort,
    onCertifyClick,
    onSessionClick,
  }: SessionResultsProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    if (isMobile) {
      return (
        <Box>
          {sessions.map((session) => (
            <MobileSessionCard
              key={session.id}
              session={session}
              onCertifyClick={onCertifyClick}
              onSessionClick={onSessionClick}
            />
          ))}
        </Box>
      );
    }

    return (
      <DesktopSessionTable
        sessions={sessions}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={onSort}
        onCertifyClick={onCertifyClick}
        onSessionClick={onSessionClick}
      />
    );
  }
);

SessionResults.displayName = "SessionResults";

export default SessionResults;