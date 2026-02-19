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
  updated_at: string;
  created_at?: string;
  certifications: any[];
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