import React, { memo, useCallback } from "react";
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Done as DoneIcon } from "@mui/icons-material";
import type { PrinterIssue } from "../types";

interface IssueActionsMenuProps {
  anchorEl: HTMLElement | null;
  issue: PrinterIssue | null;
  onClose: () => void;
  onResolve: (issue: PrinterIssue) => void;
}

const IssueActionsMenu = memo<IssueActionsMenuProps>(
  ({ anchorEl, issue, onClose, onResolve }) => {
    const handleResolve = useCallback(() => {
      if (issue) onResolve(issue);
    }, [issue, onResolve]);

    return (
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
      >
        <MenuItem onClick={handleResolve}>
          <ListItemIcon>
            <DoneIcon fontSize="small" color="success" />
          </ListItemIcon>
          <ListItemText>Mark as Resolved</ListItemText>
        </MenuItem>
      </Menu>
    );
  }
);

IssueActionsMenu.displayName = "IssueActionsMenu";
export default IssueActionsMenu;