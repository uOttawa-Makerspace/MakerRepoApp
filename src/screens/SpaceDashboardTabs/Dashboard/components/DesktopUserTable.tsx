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
import { User, SortField, SortOrder } from "../types";
import DesktopUserRow from "./DesktopUserRow";

interface ColumnConfig {
  field: SortField | "compliance";
  label: string;
  sortable: boolean;
}

const COLUMNS: ColumnConfig[] = [
  { field: "name", label: "User", sortable: true },
  { field: "email", label: "Email", sortable: true },
  { field: "compliance", label: "Compliance", sortable: false },
  { field: "flagged", label: "Status", sortable: true },
];

interface DesktopUserTableProps {
  users: User[];
  sortField: SortField;
  sortOrder: SortOrder;
  spaceName?: string;
  onSort: (field: SortField) => void;
  onNavigate: (username: string) => void;
  onSignOut: (user: User) => void;
}

const DesktopUserTable: React.FC<DesktopUserTableProps> = memo(
  ({
    users,
    sortField,
    sortOrder,
    spaceName,
    onSort,
    onNavigate,
    onSignOut,
  }) => (
    <TableContainer component={Paper} elevation={1}>
      <Table>
        <TableHead>
          <TableRow>
            {COLUMNS.map((col) => (
              <TableCell key={col.field}>
                {col.sortable ? (
                  <TableSortLabel
                    active={sortField === col.field}
                    direction={
                      sortField === col.field ? sortOrder : "asc"
                    }
                    onClick={() => onSort(col.field as SortField)}
                  >
                    {col.label}
                  </TableSortLabel>
                ) : (
                  col.label
                )}
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
              spaceName={spaceName}
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