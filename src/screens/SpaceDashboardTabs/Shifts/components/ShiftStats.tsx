import React from "react";

interface ShiftStatsProps {
  total: number;
  thisWeek: number;
}

const ShiftStats = React.memo(({ total, thisWeek }: ShiftStatsProps) => (
  <div className="shift-stats">
    <div className="stat-item">
      <span className="stat-label">Total Shifts</span>
      <span className="stat-value">{total}</span>
    </div>
    <div className="stat-item">
      <span className="stat-label">This Week</span>
      <span className="stat-value">{thisWeek}</span>
    </div>
  </div>
));

ShiftStats.displayName = "ShiftStats";

export default ShiftStats;