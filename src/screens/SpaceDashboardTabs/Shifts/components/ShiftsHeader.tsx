import React from "react";
import { CalendarMonth, RefreshOutlined } from "@mui/icons-material";

interface ShiftsHeaderProps {
  loading: boolean;
  isMobile: boolean;
  onRefresh: () => void;
}

const ShiftsHeader = React.memo(
  ({ loading, isMobile, onRefresh }: ShiftsHeaderProps) => (
    <div className="shifts-header">
      <div className="header-content">
        <div className="header-title">
          <CalendarMonth className="title-icon" />
          <h2 className="title-text">My Shifts</h2>
        </div>
        <button
          className="refresh-btn"
          onClick={onRefresh}
          disabled={loading}
          aria-label="Refresh shifts"
        >
          <RefreshOutlined className={loading ? "rotating" : ""} />
          {!isMobile && <span>Refresh</span>}
        </button>
      </div>
    </div>
  )
);

ShiftsHeader.displayName = "ShiftsHeader";

export default ShiftsHeader;