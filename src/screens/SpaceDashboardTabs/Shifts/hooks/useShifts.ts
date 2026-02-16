import { useState, useEffect, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { get } from "../../../../utils/HTTPRequests";
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
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 3);
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 3);

      const params = new URLSearchParams({
        event_type: "shift",
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      });

      if (currentUserId) {
        params.append("user_id", currentUserId.toString());
      }

      const data = await get(
        `staff/my_calendar/json/${spaceId}?${params.toString()}`
      );

      if (!Array.isArray(data)) {
        throw new Error("Invalid response format from server");
      }

      const formattedShifts: Shift[] = data
        .filter((event: any) => event.extendedProps?.eventType === "shift")
        .map((event: any) => ({
          id: event.id,
          title: event.title,
          start: event.start,
          end: event.end,
          color: extractColorFromBackground(event.extendedProps?.background),
          allDay: event.allDay,
          extendedProps: {
            reason: event.extendedProps?.description,
            training: event.extendedProps?.training,
            course: event.extendedProps?.course,
            language: event.extendedProps?.language,
            ...event.extendedProps,
          },
        }));

      setShifts(formattedShifts);
    } catch {
      setError("Failed to load shifts. Please try again.");
      toast.error("Failed to load shifts.");
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