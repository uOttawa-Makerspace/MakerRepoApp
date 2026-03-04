import React, { memo, useCallback } from "react";
import DOMPurify from "dompurify";
import {
  TableRow,
  TableCell,
  IconButton,
  Stack,
  Typography,
  Chip,
  Avatar,
  Box,
  Paper,
  Collapse,
  Tooltip,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Print as PrintIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import StatusChip from "./StatusChip";
import { formatDate } from "../utils/formatDate";
import type { PrinterIssue } from "../types";

interface DesktopIssueRowProps {
  issue: PrinterIssue;
  isExpanded: boolean;
  onToggleExpand: (id: number) => void;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, issue: PrinterIssue) => void;
}

const DesktopIssueRow = memo<DesktopIssueRowProps>(
  ({ issue, isExpanded, onToggleExpand, onMenuOpen }) => {
    const handleToggle = useCallback(
      () => onToggleExpand(issue.id),
      [issue.id, onToggleExpand]
    );

    const handleMenu = useCallback(
      (e: React.MouseEvent<HTMLElement>) => onMenuOpen(e, issue),
      [issue, onMenuOpen]
    );

    return (
      <>
        <TableRow hover sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell>
            {issue.description && (
              <IconButton size="small" onClick={handleToggle}>
                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            )}
          </TableCell>
          <TableCell>
            {issue.printer_name ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <PrintIcon fontSize="small" color="action" />
                <Typography variant="body2">{issue.printer_name}</Typography>
              </Stack>
            ) : (
              <Chip label="Unknown" size="small" color="warning" />
            )}
          </TableCell>
          <TableCell>
            <Typography variant="body2" fontWeight={500}>
              {issue.summary}
            </Typography>
          </TableCell>
          <TableCell>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar sx={{ width: 28, height: 28, fontSize: "0.875rem" }}>
                {issue.reporter.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="body2">{issue.reporter}</Typography>
            </Stack>
          </TableCell>
          <TableCell>
            <Typography variant="body2" color="text.secondary">
              {formatDate(issue.created_at)}
            </Typography>
          </TableCell>
          <TableCell>
            <StatusChip resolved={!issue.active} />
          </TableCell>
          <TableCell align="right">
            {issue.active && (
              <Tooltip title="More actions">
                <IconButton size="small" onClick={handleMenu}>
                  <MoreVertIcon />
                </IconButton>
              </Tooltip>
            )}
          </TableCell>
        </TableRow>
        {issue.description && (
          <TableRow>
            <TableCell
              style={{ paddingBottom: 0, paddingTop: 0 }}
              colSpan={7}
            >
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <Box sx={{ py: 2, px: 6 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    Description:
                  </Typography>
                  <Paper
                    variant="outlined"
                    sx={{ p: 2, mt: 1, bgcolor: "background.default" }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(issue.description) }}
                    />
                  </Paper>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        )}
      </>
    );
  }
);

DesktopIssueRow.displayName = "DesktopIssueRow";
export default DesktopIssueRow;