export interface NewTrainingSessionData {
  trainings: [string | number, string][];
  level: string[];
  course_names: string[];
  admins: [string | number, string][];
  users: [string | number, string][];
}

export interface FormErrors {
  training?: string;
  level?: string;
  course?: string;
  instructor?: string;
  users?: string;
}

export type NewTrainingSessionProps = {
  spaceId: number | string | null;
  reloadTrainingSessions: () => void;
};