import React from "react";
import {
  AdminPanelSettings as AdminIcon,
  Work as WorkIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const getRoleColor = (
  role: string
): "error" | "warning" | "default" => {
  switch (role) {
    case "admin":
      return "error";
    case "staff":
      return "warning";
    default:
      return "default";
  }
};

export const getRoleIcon = (role: string): React.ReactElement => {
  switch (role) {
    case "admin":
      return React.createElement(AdminIcon);
    case "staff":
      return React.createElement(WorkIcon);
    default:
      return React.createElement(PersonIcon);
  }
};