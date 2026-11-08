import type { TrainingSessionOptions } from "../../../api/types";

/** GET /training_session_options: trainings, levels, course_names, instructors, trainees. */
export type NewTrainingSessionData = TrainingSessionOptions;

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