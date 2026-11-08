import { useEffect, useState, useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import {
  createTrainingSession,
  getTrainingSessionOptions,
} from "../../../../api/endpoints";
import { errorMessage } from "../../../../api/client";
import { getStoredUser } from "../../../../api/tokens";
import type { NewTrainingSessionData, FormErrors } from "../types";

export function useTrainingSessionForm(
  spaceId: number | string | null,
  reloadTrainingSessions: () => void
) {
  const currentUser = getStoredUser();
  const isAdmin = currentUser?.role === "admin";

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
      // Trainings on offer depend on the space, so ask for the one on screen.
      const response: NewTrainingSessionData =
        await getTrainingSessionOptions(spaceId);
      setData(response);

      if (response.trainings?.length > 0)
        setTrainingId(String(response.trainings[0][0]));
      if (response.levels?.length > 0) setTrainingLevel(response.levels[0]);
      if (response.course_names?.length > 0)
        setTrainingCourse(response.course_names[0]);

      setTrainingInstructor(resolveDefaultInstructor(response.instructors));
    } catch (error) {
      console.error(error);
      toast.error(errorMessage(error, "Failed to load training session data"), {
        position: "bottom-center",
      });
    } finally {
      setLoading(false);
    }
  }, [resolveDefaultInstructor, spaceId]);

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
    if (!data?.trainees) return;
    setTrainingUsers(data.trainees.map((u) => String(u[0])));
    setErrors((prev) => {
      if (!prev.users) return prev;
      const { users, ...rest } = prev;
      return rest;
    });
  }, [data?.trainees]);

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
      setTrainingLevel(data.levels[0] || "");
      setTrainingCourse(data.course_names[0] || "");
      setTrainingInstructor(resolveDefaultInstructor(data.instructors));
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
      await createTrainingSession({
        space_id: Number(spaceId),
        training_id: Number(trainingId),
        level: trainingLevel,
        course: trainingCourse,
        // Staff are always the instructor of their own sessions; only admins may name someone else.
        ...(isAdmin && trainingInstructor
          ? { instructor_id: Number(trainingInstructor) }
          : {}),
        user_ids: trainingUsers.map(Number),
      });

      toast.success(
        `Training session created with ${trainingUsers.length} trainee${
          trainingUsers.length !== 1 ? "s" : ""
        }!`,
        { position: "bottom-center", icon: "🎓", duration: 4000 }
      );
      reloadTrainingSessions();
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error(errorMessage(error, "Failed to create training session. Please try again."), {
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
    isAdmin,
    reloadTrainingSessions,
    resetForm,
  ]);

  // Derived data
  const filteredUsers = useMemo(() => {
    if (!data?.trainees) return [];
    if (!searchQuery) return data.trainees;
    const q = searchQuery.toLowerCase();
    return data.trainees.filter((user) => user[1].toLowerCase().includes(q));
  }, [data?.trainees, searchQuery]);

  const selectedUsersData = useMemo(() => {
    if (!data?.trainees || trainingUsers.length === 0) return [];
    const selectedSet = new Set(trainingUsers);
    return data.trainees.filter((user) => selectedSet.has(String(user[0])));
  }, [data?.trainees, trainingUsers]);

  const trainingName = useMemo(
    () => data?.trainings.find((t) => String(t[0]) === trainingId)?.[1] ?? "",
    [data?.trainings, trainingId]
  );

  const instructorName = useMemo(
    () =>
      data?.instructors.find((a) => String(a[0]) === trainingInstructor)?.[1] ?? "",
    [data?.instructors, trainingInstructor]
  );

  return {
    // data
    data,
    loading,
    submitting,
    errors,
    isAdmin,

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