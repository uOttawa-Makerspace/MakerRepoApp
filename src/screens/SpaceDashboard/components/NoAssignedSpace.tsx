import React from "react";
import { Alert, AlertTitle, Container } from "@mui/material";

/** Shown instead of the dashboard tabs when the signed-in staff member is assigned to no space. */
const NoAssignedSpace: React.FC = () => (
  <Container maxWidth="sm" sx={{ py: 6 }}>
    <Alert severity="info">
      <AlertTitle>No assigned spaces</AlertTitle>
      You are not assigned to any space yet. Ask an admin to assign you to a space, then
      reload this page.
    </Alert>
  </Container>
);

export default NoAssignedSpace;
