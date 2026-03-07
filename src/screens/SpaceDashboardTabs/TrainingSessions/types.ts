export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  role: string;
}

export interface Certification {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  training_session_id: number;
  active: boolean;
  demotion_reason: string | null;
  demotion_staff_id: number | null;
  level: string;
}

export interface Training {
  id: string | number;
  name_en: string;
}

export interface Space {
  id: string | number;
  name: string;
}

export interface TrainingSession {
  id: string | number;
  training: Training;
  space: Space;
  course: string;
  level?: string;
  updated_at: string;
  created_at?: string;
  certifications: Certification[];
  users?: User[];
}

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