import React from "react";
import { ViewDay, ViewWeek, ViewList } from "@mui/icons-material";
import type { MobileView } from "../types";

interface ViewSwitcherProps {
  activeView: MobileView;
  onViewChange: (view: MobileView) => void;
}

const VIEW_OPTIONS: { key: MobileView; icon: React.ReactNode; label: string }[] = [
  { key: "day", icon: <ViewDay />, label: "Day" },
  { key: "week", icon: <ViewWeek />, label: "Week" },
  { key: "list", icon: <ViewList />, label: "List" },
];

const ViewSwitcher = React.memo(
  ({ activeView, onViewChange }: ViewSwitcherProps) => (
    <div className="view-switcher">
      {VIEW_OPTIONS.map(({ key, icon, label }) => (
        <button
          key={key}
          className={`view-btn ${activeView === key ? "active" : ""}`}
          onClick={() => onViewChange(key)}
        >
          {icon}
          <span>{label}</span>
        </button>
      ))}
    </div>
  )
);

ViewSwitcher.displayName = "ViewSwitcher";

export default ViewSwitcher;