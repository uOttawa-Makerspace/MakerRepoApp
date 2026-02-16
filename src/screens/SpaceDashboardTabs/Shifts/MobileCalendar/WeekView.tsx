import React from "react";
import type { DayShifts } from "../types";
import { formatWeekday, formatTime, isSameDay } from "../utils/utils";

interface WeekViewProps {
  weekShifts: DayShifts[];
  onSelectDay: (date: Date) => void;
}

const WeekDayCard = React.memo(
  ({
    day,
    onSelect,
  }: {
    day: DayShifts;
    onSelect: () => void;
  }) => {
    const isToday = isSameDay(day.date, new Date());

    return (
      <div
        className={`week-day ${isToday ? "today" : ""}`}
        onClick={onSelect}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onSelect()}
      >
        <div className="week-day-header">
          <div className="day-name">{formatWeekday(day.date)}</div>
          <div className="day-number">{day.date.getDate()}</div>
        </div>
        <div className="week-day-shifts">
          {day.shifts.length === 0 ? (
            <span className="no-shifts-text">No shifts</span>
          ) : (
            <>
              <div className="shift-count-badge">
                {day.shifts.length} {day.shifts.length === 1 ? "shift" : "shifts"}
              </div>
              {day.shifts.map((shift, idx) => (
                <div
                  key={shift.id || idx}
                  className="mini-shift"
                  style={{ backgroundColor: shift.color }}
                >
                  <div className="mini-shift-time">
                    {formatTime(shift.start)}
                  </div>
                  <div className="mini-shift-title">{shift.title}</div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    );
  }
);
WeekDayCard.displayName = "WeekDayCard";

const WeekView = React.memo(({ weekShifts, onSelectDay }: WeekViewProps) => (
  <div className="week-view">
    <div className="week-header">
      <h3>Week Overview</h3>
    </div>
    <div className="week-days">
      {weekShifts.map((day) => (
        <WeekDayCard
          key={day.date.toISOString()}
          day={day}
          onSelect={() => onSelectDay(day.date)}
        />
      ))}
    </div>
  </div>
));

WeekView.displayName = "WeekView";

export default WeekView;