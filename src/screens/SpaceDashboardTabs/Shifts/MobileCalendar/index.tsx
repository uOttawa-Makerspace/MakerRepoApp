import React from "react";
import type { Shift, MobileView, DayShifts } from "../types";
import ViewSwitcher from "./ViewSwitcher";
import DayView from "./DayView";
import WeekView from "./WeekView";
import ListView from "./ListView";

interface MobileCalendarProps {
  mobileView: MobileView;
  onViewChange: (view: MobileView) => void;
  currentDate: Date;
  isToday: boolean;
  dayShifts: Shift[];
  weekShifts: DayShifts[];
  allShifts: Shift[];
  onPreviousDay: () => void;
  onNextDay: () => void;
  onGoToToday: () => void;
  onSelectDay: (date: Date) => void;
}

const MobileCalendar = React.memo(
  ({
    mobileView,
    onViewChange,
    currentDate,
    isToday,
    dayShifts,
    weekShifts,
    allShifts,
    onPreviousDay,
    onNextDay,
    onGoToToday,
    onSelectDay,
  }: MobileCalendarProps) => (
    <div className="mobile-calendar">
      <ViewSwitcher activeView={mobileView} onViewChange={onViewChange} />

      {mobileView === "day" && (
        <DayView
          currentDate={currentDate}
          isToday={isToday}
          shifts={dayShifts}
          onPreviousDay={onPreviousDay}
          onNextDay={onNextDay}
          onGoToToday={onGoToToday}
        />
      )}

      {mobileView === "week" && (
        <WeekView weekShifts={weekShifts} onSelectDay={onSelectDay} />
      )}

      {mobileView === "list" && <ListView shifts={allShifts} />}
    </div>
  )
);

MobileCalendar.displayName = "MobileCalendar";

export default MobileCalendar;