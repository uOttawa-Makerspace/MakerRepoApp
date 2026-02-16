import React from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
  Paper,
  Typography,
  Chip,
  Button,
  Tooltip,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import type { TrainingSession, SortField, SortOrder } from "../types";
import { formatDate, isSessionCompleted } from "../utils/utils";

interface DesktopSessionTableProps {
  sessions: TrainingSession[];
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  onCertifyClick: (session: TrainingSession) => void;
}

const COLUMNS: { field: SortField; label: string }[] = [
  { field: "date", label: "Date" },
  { field: "training", label: "Training" },
  { field: "space", label: "Space" },
  { field: "course", label: "Course" },
  { field: "status", label: "Status" },
];

const SessionRow = React.memo(
  ({
    session,
    onCertifyClick,
  }: {
    session: TrainingSession;
    onCertifyClick: (session: TrainingSession) => void;
  }) => {
    const completed = isSessionCompleted(session);

    return (
      <TableRow
        hover
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell>
          <Typography variant="body2">
            {formatDate(session.updated_at)}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body2" fontWeight={500}>
            {session.training.name}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body2">{session.space.name}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body2">{session.course}</Typography>
        </TableCell>
        <TableCell>
          <Chip
            label={completed ? "Completed" : "Pending"}
            color={completed ? "success" : "warning"}
            size="small"
            icon={completed ? <CheckCircleIcon /> : <ScheduleIcon />}
          />
        </TableCell>
        <TableCell align="right">
          {!completed && (
            <Tooltip title="Certify all trainees in this session">
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => onCertifyClick(session)}
                startIcon={<CheckCircleIcon />}
              >
                Certify
              </Button>
            </Tooltip>
          )}
        </TableCell>
      </TableRow>
    );
  }
);
SessionRow.displayName = "SessionRow";

const DesktopSessionTable = React.memo(
  ({
    sessions,
    sortField,
    sortOrder,
    onSort,
    onCertifyClick,
  }: DesktopSessionTableProps) => (
    <TableContainer component={Paper} elevation={1}>
      <Table>
        <TableHead>
          <TableRow>
            {COLUMNS.map(({ field, label }) => (
              <TableCell key={field}>
                <TableSortLabel
                  active={sortField === field}
                  direction={sortField === field ? sortOrder : "asc"}
                  onClick={() => onSort(field)}
                >
                  {label}
                </TableSortLabel>
              </TableCell>
            ))}
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sessions.map((session) => (
            <SessionRow
              key={session.id}
              session={session}
              onCertifyClick={onCertifyClick}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
);

DesktopSessionTable.displayName = "DesktopSessionTable";

export default DesktopSessionTable;