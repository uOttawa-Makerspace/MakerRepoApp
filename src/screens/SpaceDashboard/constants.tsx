import {
  Dashboard as DashboardIcon,
  Add as AddIcon,
  School as SchoolIcon,
  Schedule as ScheduleIcon,
  Print as PrintIcon,
} from "@mui/icons-material";
import { TabConfig } from "./types";

export const TAB_CONFIG: TabConfig[] = [
  { label: "Dashboard", icon: <DashboardIcon />, color: "primary" },
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
  NewSession = 1,
  Sessions = 2,
  Shifts = 3,
  Printers = 4,
}