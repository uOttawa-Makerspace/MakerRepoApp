import React from "react";
import {
  Dashboard as DashboardIcon,
  Search as SearchIcon,
  Add as AddIcon,
  School as SchoolIcon,
  Schedule as ScheduleIcon,
  Print as PrintIcon,
} from "@mui/icons-material";
import { TabConfig } from "./types";

export const TAB_CONFIG: TabConfig[] = [
  { label: "Dashboard", icon: <DashboardIcon />, color: "primary" },
  { label: "Search", icon: <SearchIcon />, color: "secondary" },
  { label: "New Session", icon: <AddIcon />, color: "success" },
  { label: "Sessions", icon: <SchoolIcon />, color: "info" },
  { label: "Shifts", icon: <ScheduleIcon />, color: "warning" },
  { label: "Printers", icon: <PrintIcon />, color: "error" },
];

export const TOASTER_OPTIONS = {
  duration: 3000,
  style: {
    background: "#363636",
    color: "#fff",
  },
  success: {
    iconTheme: {
      primary: "#ff6f00",
      secondary: "#fff",
    },
  },
  error: {
    iconTheme: {
      primary: "#d32f2f",
      secondary: "#fff",
    },
  },
} as const;

export enum TabIndex {
  Dashboard = 0,
  Search = 1,
  NewSession = 2,
  Sessions = 3,
  Shifts = 4,
  Printers = 5,
}