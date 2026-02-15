import React, { memo } from "react";
import { Box, Alert } from "@mui/material";
import PrinterLinkForm from "./PrinterLinkForm";
import type { PrinterType, UserOption } from "../types";

interface LinkPrintersTabProps {
  printers: PrinterType[];
  users: UserOption[];
  onLink: () => void;
}

const LinkPrintersTab = memo<LinkPrintersTabProps>(
  ({ printers, users, onLink }) => {
    if (users.length === 0) {
      return (
        <Alert severity="info">
          No users signed in. Please sign in users before linking printers.
        </Alert>
      );
    }

    if (printers.length === 0) {
      return <Alert severity="warning">No printers available.</Alert>;
    }

    return (
      <Box>
        {printers.map((printerType) => (
          <PrinterLinkForm
            key={printerType.id}
            printerType={printerType}
            users={users}
            onLink={onLink}
          />
        ))}
      </Box>
    );
  }
);

LinkPrintersTab.displayName = "LinkPrintersTab";
export default LinkPrintersTab;