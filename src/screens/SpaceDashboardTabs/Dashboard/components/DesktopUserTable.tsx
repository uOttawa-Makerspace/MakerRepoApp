import React, { memo, useCallback } from "react";
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
import { User, SortField, SortOrder } from "../types";
import DesktopUserRow from "./DesktopUserRow";

interface ColumnConfig {
  field: SortField;
  label: string;
}

const COLUMNS: ColumnConfig[] = [
  { field: "name", label: "User" },
  { field: "email", label: "Email" },
  { field: "flagged", label: "Status" },
];

interface DesktopUserTableProps {
  users: User[];
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  onNavigate: (username: string) => void;
  onSignOut: (user: User) => void;
}

const DesktopUserTable: React.FC<DesktopUserTableProps> = memo(
  ({ users, sortField, sortOrder, onSort, onNavigate, onSignOut }) => (
    <TableContainer component={Paper} elevation={1}>
      <Table>
        <TableHead>
          <TableRow>
            {COLUMNS.map((col) => (
              <TableCell key={col.field}>
                <TableSortLabel
                  active={sortField === col.field}
                  direction={
                    sortField === col.field ? sortOrder : "asc"
                  }
                  onClick={() => onSort(col.field)}
                >
                  {col.label}
                </TableSortLabel>
              </TableCell>
            ))}
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <DesktopUserRow
              key={user.id}
              user={user}
              onNavigate={onNavigate}
              onSignOut={onSignOut}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
);

DesktopUserTable.displayName = "DesktopUserTable";

export default DesktopUserTable;