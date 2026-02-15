import React from "react";
import type { ShiftsProps } from "./types";
import { useShifts } from "./hooks/useShifts";
import { useMobileDetect } from "./hooks/useMobileDetect";
import ShiftsHeader from "./components/ShiftsHeader";
import { LoadingOverlay, ErrorState, EmptyState } from "./components/CalendarStates";
import ShiftStats from "./components/ShiftStats";
import DesktopCalendar from "./components/DesktopCalendar";
import MobileCalendar from "./MobileCalendar";
import "./Shifts.scss";

const Shifts: React.FC<ShiftsProps> = ({
  reloadShifts,
  spaceId,
  currentUserId,
}) => {
  const isMobile = useMobileDetect();

  const {
    shifts,
    loading,
    error,
    mobileView,
    setMobileView,
    currentDate,
    dayShifts,
    weekShifts,
    isToday,
    stats,
    fetchShifts,
    handleRefresh,
    goToPreviousDay,
    goToNextDay,
    goToToday,
    selectDay,
  } = useShifts(reloadShifts, spaceId, currentUserId);

  const hasShifts = shifts.length > 0;

  return (
    <div className="shifts-container">
      <ShiftsHeader
        loading={loading}
        isMobile={isMobile}
        onRefresh={handleRefresh}
      />

      <div className="calendar-card">
        {loading && <LoadingOverlay />}

        {error && !loading && (
          <ErrorState message={error} onRetry={fetchShifts} />
        )}

        {!loading && !error && !hasShifts && <EmptyState />}

        {!loading && !error && hasShifts && (
          <>
            {isMobile ? (
              <MobileCalendar
                mobileView={mobileView}
                onViewChange={setMobileView}
                currentDate={currentDate}
                isToday={isToday}
                dayShifts={dayShifts}
                weekShifts={weekShifts}
                allShifts={shifts}
                onPreviousDay={goToPreviousDay}
                onNextDay={goToNextDay}
                onGoToToday={goToToday}
                onSelectDay={selectDay}
              />
            ) : (
              <DesktopCalendar shifts={shifts} />
            )}

            <ShiftStats total={stats.total} thisWeek={stats.thisWeek} />
          </>
        )}
      </div>
    </div>
  );
};

export default Shifts;