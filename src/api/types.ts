/** Response and request shapes of /api/v1 (contracts: doc/api/v1/*.md). snake_case as the API sends it. */

export type Role = "regular_user" | "volunteer" | "staff" | "admin";
/** Roles an admin can assign with PATCH /users/:id/role. */
export type AssignableRole = "admin" | "staff" | "regular_user";

/** The only user fields the app keeps (session.md: id, username, name, role). */
export interface SessionUser {
  id: number;
  username: string;
  name: string;
  role: Role;
}

export interface SessionResponse {
  access_token: string;
  access_token_expires_at: string;
  refresh_token: string;
  user: SessionUser;
}

export interface Space {
  id: number;
  name: string;
}

// --- users ---

export interface ProfileUser {
  id: number;
  username: string;
  name: string;
  email: string;
  faculty: string | null;
  program: string | null;
  year_of_study: string | null;
  identity: string | null;
  role: Role;
  avatar_url: string;
  rfid: { card_number: string } | null;
}

export interface ProfileCertification {
  id: number;
  updated_at: string;
  training: { id: number; name_en: string };
}

export interface ProfileResponse {
  user: ProfileUser;
  programs: string[];
  certifications: ProfileCertification[];
  remaining_trainings: { id: number; name_en: string }[];
}

export interface UserSearchResult {
  id: number;
  username: string;
  name: string;
  email: string;
  avatar_url: string;
}

export interface UserSearchResponse {
  users: UserSearchResult[];
  meta: { limit: number; truncated: boolean };
}

export interface ProgramsResponse {
  programs: string[];
}

// --- presence ---

export interface PresenceUser {
  id: number;
  username: string;
  name: string;
  email: string;
  flagged: boolean | null;
  avatar_url: string;
  certifications: { id: number; name: string }[];
  signed_safety_sheet: boolean;
  membership_status: boolean;
}

export interface PresenceResponse {
  space: Space;
  users: PresenceUser[];
  current_user: { id: number };
}

// --- rfid ---

export interface UnlinkedCard {
  card_number: string;
  /** ISO 8601 UTC. */
  tapped_at: string;
}

export interface RfidTapResponse {
  success: "RFID sign in" | "RFID sign out";
}

// --- training sessions ---

export interface TrainingSessionUser {
  id: number;
  username: string;
  name: string;
  email: string;
}

export interface TrainingSession {
  id: number;
  course: string | null;
  level: string;
  updated_at: string;
  training: { id: number; name_en: string } | null;
  space: Space | null;
  certifications: { active: boolean; user_id: number }[];
  users: TrainingSessionUser[];
}

export interface TrainingSessionOptions {
  /** [id, name] pairs. */
  trainings: [number, string][];
  levels: string[];
  course_names: string[];
  instructors: [number, string][];
  trainees: [number, string][];
}

export interface CreateTrainingSessionRequest {
  space_id: number;
  training_id: number;
  level: string;
  course?: string;
  /** Staff may omit it or send their own id; only admins may name someone else. */
  instructor_id?: number;
  user_ids?: number[];
}

// --- printers ---

export interface Printer {
  id: number;
  number: string;
  maintenance: boolean;
  has_issues: boolean;
}

export interface PrinterType {
  id: number;
  name: string;
  short_form: string;
  available: boolean;
  printers: Printer[];
}

export interface PrinterIssueRecord {
  id: number;
  printer_id: number;
  /** Display name only; null when the reporter's account is gone. */
  reporter: string | null;
  summary: string;
  description: string;
  created_at: string;
  active: boolean;
}

// --- shifts ---

export interface ShiftEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  extendedProps: {
    eventType: string;
    description?: string | null;
    background?: string;
  };
}

// --- support requests ---

export interface SupportRequest {
  name?: string;
  email?: string;
  subject: string;
  comments: string;
  app_version?: string;
}

// --- contact infos ---

export type DayName =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

export interface OpeningDay {
  status: "open" | "closed" | "hidden";
  /** 24-hour "HH:MM" wall-clock time. */
  opening: string | null;
  closing: string | null;
}

export interface OpeningHours {
  target_en: string | null;
  target_fr: string | null;
  notes_en: string | null;
  notes_fr: string | null;
  closed_all_week: boolean;
  days: Record<DayName, OpeningDay>;
}

export interface ContactInfo {
  name: string;
  email: string | null;
  address: string | null;
  phone_number: string | null;
  opening_hours: OpeningHours[];
}
