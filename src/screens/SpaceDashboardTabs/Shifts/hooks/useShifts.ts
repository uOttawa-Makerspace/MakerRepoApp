import { useState, useEffect, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { listShifts } from "../../../../api/endpoints";
import { errorMessage } from "../../../../api/client";
import type { ShiftEvent } from "../../../../api/types";
import type { Shift, MobileView, DayShifts } from "../types";
import { extractColorFromBackground, isSameDay, getWeekStart } from "../utils/utils";

export const useShifts = (
  reloadShifts: number,
  spaceId?: number,
  currentUserId?: number
) => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<MobileView>("day");
  const [currentDate, setCurrentDate] = useState(new Date());

  const fetchShifts = useCallback(async () => {
    if (!spaceId) return;

    setLoading(true);
    setError(null);

    try {
      // The API caps a request at 100 days, so the old +-3 months window is fetched as two
      // requests that overlap by two days (a one-off shift is only listed when it lies fully inside
      // the window). Results are merged by id.
      const DAY = 24 * 60 * 60 * 1000;
      const now = Date.now();
      const windows = [
        { start: new Date(now - 92 * DAY), end: new Date(now + 1 * DAY) },
        { start: new Date(now - 1 * DAY), end: new Date(now + 92 * DAY) },
      ];

      const results = await Promise.all(
        windows.map((range) => listShifts(spaceId, range, currentUserId))
      );
      const byId = new Map<string, ShiftEvent>();
      results.flat().forEach((event) => byId.set(event.id, event));
      const data = Array.from(byId.values()).sort(
        (a, b) => Date.parse(a.start) - Date.parse(b.start)
      );

      const formattedShifts: Shift[] = data
        .filter((event) => event.extendedProps?.eventType === "shift")
        .map((event) => ({
          id: event.id,
          title: event.title,
          start: event.start,
          end: event.end,
          color: extractColorFromBackground(event.extendedProps?.background),
          allDay: event.allDay,
          extendedProps: {
            reason: event.extendedProps?.description ?? undefined,
            ...event.extendedProps,
          },
        }));

      setShifts(formattedShifts);
    } catch (caught) {
      setError("Failed to load shifts. Please try again.");
      toast.error(errorMessage(caught, "Failed to load shifts."));
    } finally {
      setLoading(false);
    }
  }, [spaceId, currentUserId]);

  useEffect(() => {
    fetchShifts();
  }, [fetchShifts, reloadShifts]);

  const handleRefresh = useCallback(() => {
    fetchShifts();
    toast.success("Shifts refreshed!");
  }, [fetchShifts]);

  // Date navigation
  const goToPreviousDay = useCallback(() => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      next.setDate(next.getDate() - 1);
      return next;
    });
  }, []);

  const goToNextDay = useCallback(() => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      next.setDate(next.getDate() + 1);
      return next;
    });
  }, []);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const selectDay = useCallback((date: Date) => {
    setCurrentDate(date);
    setMobileView("day");
  }, []);

  // Derived data
  const dayShifts = useMemo(
    () =>
      shifts.filter((shift) =>
        isSameDay(new Date(shift.start), currentDate)
      ),
    [shifts, currentDate]
  );

  const weekShifts: DayShifts[] = useMemo(() => {
    const weekStart = getWeekStart(currentDate);
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      return {
        date: day,
        shifts: shifts.filter((shift) =>
          isSameDay(new Date(shift.start), day)
        ),
      };
    });
  }, [shifts, currentDate]);

  const isToday = useMemo(
    () => isSameDay(currentDate, new Date()),
    [currentDate]
  );

  // Statistics
  const stats = useMemo(() => {
    const now = new Date();
    const weekStart = getWeekStart(now);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    const thisWeekCount = shifts.filter((shift) => {
      const shiftDate = new Date(shift.start);
      return shiftDate >= weekStart && shiftDate < weekEnd;
    }).length;

    return {
      total: shifts.length,
      thisWeek: thisWeekCount,
    };
  }, [shifts]);

  return {
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
  };
};