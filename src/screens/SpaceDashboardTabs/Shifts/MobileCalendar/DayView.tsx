import React from "react";
import { ChevronLeft, ChevronRight, AccessTime } from "@mui/icons-material";
import type { Shift } from "../types";
import { formatDateShort } from "../utils/utils";
import ShiftCard from "./ShiftCard";

interface DayViewProps {
  currentDate: Date;
  isToday: boolean;
  shifts: Shift[];
  onPreviousDay: () => void;
  onNextDay: () => void;
  onGoToToday: () => void;
}

const DayView = React.memo(
  ({
    currentDate,
    isToday,
    shifts,
    onPreviousDay,
    onNextDay,
    onGoToToday,
  }: DayViewProps) => (
    <div className="day-view">
      {/* Date Navigation */}
      <div className="date-navigation">
        <button className="nav-btn" onClick={onPreviousDay} aria-label="Previous day">
          <ChevronLeft />
        </button>

        <div className="current-date">
          <div className="date-main">{formatDateShort(currentDate)}</div>
          {isToday && <span className="today-badge">Today</span>}
        </div>

        <button className="nav-btn" onClick={onNextDay} aria-label="Next day">
          <ChevronRight />
        </button>
      </div>

      {!isToday && (
        <button className="today-btn" onClick={onGoToToday}>
          Go to Today
        </button>
      )}

      {/* Shifts */}
      <div className="day-shifts">
        {shifts.length === 0 ? (
          <div className="no-shifts-day">
            <AccessTime className="no-shifts-icon" />
            <p>No shifts scheduled for this day</p>
          </div>
        ) : (
          shifts.map((shift, index) => (
            <ShiftCard key={shift.id || index} shift={shift} />
          ))
        )}
      </div>
    </div>
  )
);

DayView.displayName = "DayView";

export default DayView;