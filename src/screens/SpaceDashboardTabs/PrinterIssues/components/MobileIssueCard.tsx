import React, { memo, useCallback } from "react";
import DOMPurify from "dompurify";
import {
  Card,
  CardContent,
  Stack,
  Box,
  Typography,
  Chip,
  IconButton,
  Button,
  Paper,
  Collapse,
} from "@mui/material";
import {
  Print as PrintIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  MoreVert as MoreVertIcon,
  Done as DoneIcon,
} from "@mui/icons-material";
import StatusChip from "./StatusChip";
import { formatDate } from "../utils/formatDate";
import type { PrinterIssue } from "../types";

interface MobileIssueCardProps {
  issue: PrinterIssue;
  isExpanded: boolean;
  onToggleExpand: (id: number) => void;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, issue: PrinterIssue) => void;
  onResolve: (issue: PrinterIssue) => void;
}

const PrinterChip = memo<{ name?: string }>(({ name }) =>
  name ? (
    <Chip icon={<PrintIcon />} label={name} size="small" variant="outlined" />
  ) : (
    <Chip label="Unknown Printer" size="small" color="warning" variant="outlined" />
  )
);

PrinterChip.displayName = "PrinterChip";

const MobileIssueCard = memo<MobileIssueCardProps>(
  ({ issue, isExpanded, onToggleExpand, onMenuOpen, onResolve }) => {
    const handleToggle = useCallback(
      () => onToggleExpand(issue.id),
      [issue.id, onToggleExpand]
    );

    const handleMenu = useCallback(
      (e: React.MouseEvent<HTMLElement>) => onMenuOpen(e, issue),
      [issue, onMenuOpen]
    );

    const handleResolve = useCallback(
      () => onResolve(issue),
      [issue, onResolve]
    );

    return (
      <Card
        sx={{
          mb: 2,
          border: 1,
          borderColor: issue.active ? "success.main" : "error.main",
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Stack spacing={2}>
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start"
              }}
            >
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: "center", mb: 0.5 }}
                >
                  <PrinterChip name={issue.printer_name} />
                  <StatusChip resolved={!issue.active} />
                </Stack>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {issue.summary}
                </Typography>
              </Box>
              {issue.active && (
                <IconButton size="small" onClick={handleMenu}>
                  <MoreVertIcon />
                </IconButton>
              )}
            </Box>

            {/* Meta */}
            <Stack spacing={1}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PersonIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {issue.reporter}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {formatDate(issue.created_at)}
                </Typography>
              </Box>
            </Stack>

            {/* Expandable Description */}
            {issue.description && (
              <>
                <Button
                  size="small"
                  onClick={handleToggle}
                  endIcon={
                    isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />
                  }
                  sx={{ alignSelf: "flex-start" }}
                >
                  {isExpanded ? "Hide Details" : "Show Details"}
                </Button>
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <Paper
                    variant="outlined"
                    sx={{ p: 2, bgcolor: "background.default" }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(issue.description) }}
                    />
                  </Paper>
                </Collapse>
              </>
            )}

            {/* Resolve */}
            {issue.active && (
              <Button
                fullWidth
                variant="contained"
                color="success"
                startIcon={<DoneIcon />}
                onClick={handleResolve}
              >
                Mark as Resolved
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
    );
  }
);

MobileIssueCard.displayName = "MobileIssueCard";
export default MobileIssueCard;