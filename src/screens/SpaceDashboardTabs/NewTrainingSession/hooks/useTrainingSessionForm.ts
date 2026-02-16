import { useEffect, useState, useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import * as HTTPRequest from "../../../../utils/HTTPRequests";
import { getUser } from "../../../../utils/Common";
import type { NewTrainingSessionData, FormErrors } from "../types";

export function useTrainingSessionForm(
  spaceId: number | string | null,
  reloadTrainingSessions: () => void
) {
  const currentUser = getUser();

  // Form state
  const [data, setData] = useState<NewTrainingSessionData | null>(null);
  const [trainingId, setTrainingId] = useState("");
  const [trainingLevel, setTrainingLevel] = useState("");
  const [trainingCourse, setTrainingCourse] = useState("");
  const [trainingInstructor, setTrainingInstructor] = useState("");
  const [trainingUsers, setTrainingUsers] = useState<string[]>([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const resolveDefaultInstructor = useCallback(
    (admins: [string | number, string][]) => {
      if (!admins?.length) return "";

      if (currentUser?.id) {
        const currentUserId = String(currentUser.id);
        const isInAdminsList = admins.some(
          (admin) => String(admin[0]) === currentUserId
        );
        if (isInAdminsList) return currentUserId;
      }

      return String(admins[0][0]);
    },
    [currentUser?.id]
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response: NewTrainingSessionData = await HTTPRequest.get(
        "staff/training_sessions/new"
      );
      setData(response);

      if (response.trainings?.length > 0)
        setTrainingId(String(response.trainings[0][0]));
      if (response.level?.length > 0) setTrainingLevel(response.level[0]);
      if (response.course_names?.length > 0)
        setTrainingCourse(response.course_names[0]);

      setTrainingInstructor(resolveDefaultInstructor(response.admins));
    } catch (error) {
      console.error(error);
      toast.error("Failed to load training session data", {
        position: "bottom-center",
      });
    } finally {
      setLoading(false);
    }
  }, [resolveDefaultInstructor]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const clearFieldError = useCallback((field: keyof FormErrors) => {
    setErrors((prev) => {
      if (!prev[field]) return prev; // avoid unnecessary state update
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const handleUserToggle = useCallback((userId: string) => {
    setTrainingUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
    setErrors((prev) => {
      if (!prev.users) return prev;
      const { users, ...rest } = prev;
      return rest;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (!data?.users) return;
    setTrainingUsers(data.users.map((u) => String(u[0])));
    setErrors((prev) => {
      if (!prev.users) return prev;
      const { users, ...rest } = prev;
      return rest;
    });
  }, [data?.users]);

  const handleDeselectAll = useCallback(() => {
    setTrainingUsers([]);
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!trainingId) newErrors.training = "Please select a training";
    if (!trainingLevel) newErrors.level = "Please select a level";
    if (!trainingCourse) newErrors.course = "Please select a course";
    if (!trainingInstructor)
      newErrors.instructor = "Please select an instructor";
    if (trainingUsers.length === 0)
      newErrors.users = "Please select at least one user";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [trainingId, trainingLevel, trainingCourse, trainingInstructor, trainingUsers]);

  const resetForm = useCallback(() => {
    setTrainingUsers([]);
    setSearchQuery("");
    setErrors({});
    if (data) {
      setTrainingId(
        data.trainings[0]?.[0] ? String(data.trainings[0][0]) : ""
      );
      setTrainingLevel(data.level[0] || "");
      setTrainingCourse(data.course_names[0] || "");
      setTrainingInstructor(resolveDefaultInstructor(data.admins));
    }
  }, [data, resolveDefaultInstructor]);

  const handleSubmit = useCallback(() => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields", {
        position: "bottom-center",
      });
      return;
    }
    setConfirmDialog(true);
  }, [validateForm]);

  const handleConfirmSubmit = useCallback(async () => {
    if (spaceId === null) {
      toast.error("No space selected", { position: "bottom-center" });
      return;
    }

    setSubmitting(true);
    setConfirmDialog(false);

    try {
      const response = await HTTPRequest.post("staff/training_sessions", {
        training_session: { space_id: spaceId },
        training_id: trainingId,
        level: trainingLevel,
        course: trainingCourse,
        user_id: trainingInstructor,
        training_session_users: trainingUsers,
      });

      if (response.data.created === true) {
        toast.success(
          `Training session created with ${trainingUsers.length} trainee${
            trainingUsers.length !== 1 ? "s" : ""
          }!`,
          { position: "bottom-center", icon: "🎓", duration: 4000 }
        );
        reloadTrainingSessions();
        resetForm();
      } else {
        toast.error("Error creating training session!", {
          position: "bottom-center",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create training session. Please try again.", {
        position: "bottom-center",
      });
    } finally {
      setSubmitting(false);
    }
  }, [
    spaceId,
    trainingId,
    trainingLevel,
    trainingCourse,
    trainingInstructor,
    trainingUsers,
    reloadTrainingSessions,
    resetForm,
  ]);

  // Derived data
  const filteredUsers = useMemo(() => {
    if (!data?.users) return [];
    if (!searchQuery) return data.users;
    const q = searchQuery.toLowerCase();
    return data.users.filter((user) => user[1].toLowerCase().includes(q));
  }, [data?.users, searchQuery]);

  const selectedUsersData = useMemo(() => {
    if (!data?.users || trainingUsers.length === 0) return [];
    const selectedSet = new Set(trainingUsers);
    return data.users.filter((user) => selectedSet.has(String(user[0])));
  }, [data?.users, trainingUsers]);

  const trainingName = useMemo(
    () => data?.trainings.find((t) => String(t[0]) === trainingId)?.[1] ?? "",
    [data?.trainings, trainingId]
  );

  const instructorName = useMemo(
    () =>
      data?.admins.find((a) => String(a[0]) === trainingInstructor)?.[1] ?? "",
    [data?.admins, trainingInstructor]
  );

  return {
    // data
    data,
    loading,
    submitting,
    errors,

    // form values
    trainingId,
    trainingLevel,
    trainingCourse,
    trainingInstructor,
    trainingUsers,
    searchQuery,
    confirmDialog,

    // setters
    setTrainingId,
    setTrainingLevel,
    setTrainingCourse,
    setTrainingInstructor,
    setSearchQuery,
    setConfirmDialog,

    // derived
    filteredUsers,
    selectedUsersData,
    trainingName,
    instructorName,

    // actions
    clearFieldError,
    handleUserToggle,
    handleSelectAll,
    handleDeselectAll,
    handleSubmit,
    handleConfirmSubmit,
    resetForm,
  };
}