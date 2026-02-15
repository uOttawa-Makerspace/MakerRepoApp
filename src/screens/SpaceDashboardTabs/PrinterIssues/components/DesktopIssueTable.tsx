import React, { memo } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
  Paper,
} from "@mui/material";
import DesktopIssueRow from "./DesktopIssueRow";
import type { PrinterIssue, SortField, SortOrder } from "../types";

interface DesktopIssueTableProps {
  issues: PrinterIssue[];
  expandedIssue: number | null;
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  onToggleExpand: (id: number) => void;
  onMenuOpen: (
    event: React.MouseEvent<HTMLElement>,
    issue: PrinterIssue
  ) => void;
}

interface ColumnDef {
  field: SortField;
  label: string;
}

const SORTABLE_COLUMNS: ColumnDef[] = [
  { field: "printer", label: "Printer" },
  { field: "summary", label: "Summary" },
  { field: "reporter", label: "Reporter" },
  { field: "created_at", label: "Created" },
];

const DesktopIssueTable = memo<DesktopIssueTableProps>(
  ({
    issues,
    expandedIssue,
    sortField,
    sortOrder,
    onSort,
    onToggleExpand,
    onMenuOpen,
  }) => (
    <TableContainer component={Paper} elevation={1}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width={50} />
            {SORTABLE_COLUMNS.map(({ field, label }) => (
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
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {issues.map((issue) => (
            <DesktopIssueRow
              key={issue.id}
              issue={issue}
              isExpanded={expandedIssue === issue.id}
              onToggleExpand={onToggleExpand}
              onMenuOpen={onMenuOpen}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
);

DesktopIssueTable.displayName = "DesktopIssueTable";
export default DesktopIssueTable;