import { useState, useEffect, useCallback, useMemo } from "react";
import * as HTTPRequest from "../../../utils/HTTPRequests";
import { SpaceData, LoadingState, ErrorState } from "../types";
import { TabIndex } from "../constants";

export const useSpaceDashboard = () => {
  const [inSpaceUsers, setInSpaceUsers] = useState<SpaceData | null>(null);
  const [trainingSessions, setTrainingSessions] = useState<any>(null);
  const [printers, setPrinters] = useState<any>(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [shiftsReloadTrigger, setShiftsReloadTrigger] = useState(0);
  const [visitedTabs, setVisitedTabs] = useState<Set<number>>(
    new Set([0])
  );

  const [loading, setLoading] = useState<LoadingState>({
    users: true,
    sessions: false,
    printers: false,
  });

  const [errors, setErrors] = useState<ErrorState>({
    users: null,
    sessions: null,
    printers: null,
  });

  // --- Data fetchers ---

  const getCurrentUsers = useCallback(async () => {
    setLoading((prev) => ({ ...prev, users: true }));
    setErrors((prev) => ({ ...prev, users: null }));

    try {
      const response = await HTTPRequest.get("staff_dashboard");
      setInSpaceUsers(response);
      if (response.current_user?.id) {
        setCurrentUserId(response.current_user.id);
      }
    } catch (error) {
      console.error(error);
      setErrors((prev) => ({ ...prev, users: "Failed to load users" }));
    } finally {
      setLoading((prev) => ({ ...prev, users: false }));
    }
  }, []);

  const getTrainingSessions = useCallback(async () => {
    setLoading((prev) => ({ ...prev, sessions: true }));
    setErrors((prev) => ({ ...prev, sessions: null }));

    try {
      const response = await HTTPRequest.get("staff/training_sessions");
      setTrainingSessions(response);
    } catch (error) {
      console.error(error);
      setErrors((prev) => ({
        ...prev,
        sessions: "Failed to load training sessions",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, sessions: false }));
    }
  }, []);

  const getPrinterData = useCallback(async () => {
    setLoading((prev) => ({ ...prev, printers: true }));
    setErrors((prev) => ({ ...prev, printers: null }));

    try {
      const response = await HTTPRequest.get("printers/printer_data");
      setPrinters(response);
    } catch (error) {
      console.error(error);
      setErrors((prev) => ({
        ...prev,
        printers: "Failed to load printers",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, printers: false }));
    }
  }, []);

  const handleReloadShifts = useCallback(() => {
    setShiftsReloadTrigger((prev) => prev + 1);
  }, []);

  // --- Tab management ---

  const handleTabChange = useCallback((newValue: number) => {
    setTabIndex(newValue);
    setVisitedTabs((prev) => {
      if (prev.has(newValue)) return prev;
      return new Set(prev).add(newValue);
    });
  }, []);

  // --- Effects: data loading ---

  useEffect(() => {
    getCurrentUsers();
  }, [getCurrentUsers]);

  useEffect(() => {
    if (
      (visitedTabs.has(TabIndex.NewSession) ||
        visitedTabs.has(TabIndex.Sessions)) &&
      !trainingSessions &&
      !loading.sessions
    ) {
      getTrainingSessions();
    }
  }, [visitedTabs, trainingSessions, loading.sessions, getTrainingSessions]);

  useEffect(() => {
    if (
      visitedTabs.has(TabIndex.Printers) &&
      !printers &&
      !loading.printers
    ) {
      getPrinterData();
    }
  }, [visitedTabs, printers, loading.printers, getPrinterData]);

  useEffect(() => {
    if (inSpaceUsers?.space?.id && visitedTabs.has(TabIndex.Shifts)) {
      handleReloadShifts();
    }
  }, [inSpaceUsers?.space?.id, visitedTabs, handleReloadShifts]);

  // --- Derived state ---

  const isInitialLoading = loading.users && !inSpaceUsers;

  const userCount = useMemo(
    () => inSpaceUsers?.space_users?.length || 0,
    [inSpaceUsers?.space_users?.length]
  );

  const flaggedCount = useMemo(
    () =>
      inSpaceUsers?.space_users?.filter((u) => u.flagged)?.length || 0,
    [inSpaceUsers?.space_users]
  );

  const spaceId = inSpaceUsers?.space?.id ?? null;
  const spaceName = inSpaceUsers?.space?.name || "Loading...";

  return {
    inSpaceUsers,
    trainingSessions,
    printers,
    tabIndex,
    currentUserId,
    shiftsReloadTrigger,
    loading,
    errors,
    isInitialLoading,
    userCount,
    flaggedCount,
    spaceId,
    spaceName,
    handleTabChange,
    getCurrentUsers,
    getTrainingSessions,
    getPrinterData,
    handleReloadShifts,
  };
};