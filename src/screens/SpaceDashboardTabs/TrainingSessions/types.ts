import type {
  TrainingSession as ApiTrainingSession,
  TrainingSessionUser,
} from "../../../api/types";

export type User = TrainingSessionUser;
export type TrainingSession = ApiTrainingSession;

export type SortField = "date" | "training" | "space" | "course" | "status";
export type SortOrder = "asc" | "desc";
export type StatusFilter = "all" | "completed" | "pending";

export interface SessionStats {
  total: number;
  completed: number;
  pending: number;
}

export interface CertifyDialogState {
  open: boolean;
  session: TrainingSession | null;
}

export interface UsersDialogState {
  open: boolean;
  session: TrainingSession | null;
}