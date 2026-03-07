import { useState, useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import * as HTTPRequest from "../../../../utils/HTTPRequests";
import type {
  TrainingSession,
  SortField,
  SortOrder,
  StatusFilter,
  SessionStats,
  CertifyDialogState,
  UsersDialogState,
} from "../types";
import { isSessionCompleted, sortSessions } from "../utils/utils";

export const useTrainingSessions = (
  trainingSessions: TrainingSession[] | null,
  reloadTrainingSessions: () => void
) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [certifyDialog, setCertifyDialog] = useState<CertifyDialogState>({
    open: false,
    session: null,
  });
  const [certifying, setCertifying] = useState(false);

  const [usersDialog, setUsersDialog] = useState<UsersDialogState>({
    open: false,
    session: null,
  });

  // Sorting
  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortOrder("asc");
      }
    },
    [sortField]
  );

  // Search
  const clearSearch = useCallback(() => setSearchQuery(""), []);

  // Certify dialog
  const openCertifyDialog = useCallback((session: TrainingSession) => {
    setCertifyDialog({ open: true, session });
  }, []);

  const closeCertifyDialog = useCallback(() => {
    setCertifyDialog({ open: false, session: null });
  }, []);

  const confirmCertify = useCallback(async () => {
    if (!certifyDialog.session) return;

    setCertifying(true);

    try {
      const response = await HTTPRequest.post(
        `staff/training_sessions/${certifyDialog.session.id}/certify_trainees`,
        {}
      );

      if (response.data.certified === true) {
        toast.success(
          `Successfully certified trainees for ${certifyDialog.session.training.name_en}!`,
          {
            position: "bottom-center",
            icon: "🎓",
            duration: 4000,
          }
        );
        reloadTrainingSessions();
        closeCertifyDialog();
      } else {
        toast.error(
          "Some users couldn't be certified. They may already have this certification.",
          { position: "bottom-center", duration: 5000 }
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to certify users. Please try again.", {
        position: "bottom-center",
      });
    } finally {
      setCertifying(false);
    }
  }, [certifyDialog.session, reloadTrainingSessions, closeCertifyDialog]);

  // Users dialog
  const openUsersDialog = useCallback((session: TrainingSession) => {
    setUsersDialog({ open: true, session });
  }, []);

  const closeUsersDialog = useCallback(() => {
    setUsersDialog({ open: false, session: null });
  }, []);

  // Filtered and sorted results
  const filteredAndSortedSessions = useMemo(() => {
    if (!trainingSessions) return [];

    const lowerQuery = searchQuery.toLowerCase();

    const filtered = trainingSessions.filter((session) => {
      const matchesSearch =
        !lowerQuery ||
        (session.training?.name_en ?? "").toLowerCase().includes(lowerQuery) ||
        (session.space?.name ?? "").toLowerCase().includes(lowerQuery) ||
        (session.course ?? "").toLowerCase().includes(lowerQuery);

      const completed = isSessionCompleted(session);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "completed" && completed) ||
        (statusFilter === "pending" && !completed);

      return matchesSearch && matchesStatus;
    });

    return sortSessions(filtered, sortField, sortOrder);
  }, [trainingSessions, searchQuery, sortField, sortOrder, statusFilter]);

  // Stats
  const stats: SessionStats = useMemo(() => {
    if (!trainingSessions) return { total: 0, completed: 0, pending: 0 };

    const completed = trainingSessions.filter(isSessionCompleted).length;
    return {
      total: trainingSessions.length,
      completed,
      pending: trainingSessions.length - completed,
    };
  }, [trainingSessions]);

  return {
    // Search & filter
    searchQuery,
    setSearchQuery,
    clearSearch,
    statusFilter,
    setStatusFilter,

    // Sort
    sortField,
    sortOrder,
    handleSort,

    // Certify
    certifyDialog,
    certifying,
    openCertifyDialog,
    closeCertifyDialog,
    confirmCertify,

    usersDialog,
    openUsersDialog,
    closeUsersDialog,

    filteredAndSortedSessions,
    stats,
  };
};