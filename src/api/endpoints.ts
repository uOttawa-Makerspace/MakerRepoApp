import {
  api,
  endSession,
  REFRESH_TIMEOUT_MS,
  request,
  requestWithHeaders,
  seg,
} from "./client";
import { getRefreshToken, storeSession } from "./tokens";
import type {
  AssignableRole,
  ContactInfo,
  CreateTrainingSessionRequest,
  PresenceResponse,
  PrinterIssueRecord,
  PrinterType,
  ProfileResponse,
  ProgramsResponse,
  RfidTapResponse,
  SessionResponse,
  SessionUser,
  SpaceDashboardData,
  ShiftEvent,
  Space,
  SupportRequest,
  TrainingSession,
  TrainingSessionOptions,
  UnlinkedCard,
  UserSearchResponse,
} from "./types";

/** Typed wrappers around /api/v1 (contracts: doc/api/v1/*.md). */

// --- session ---

export const login = async (
  loginName: string,
  password: string,
): Promise<SessionUser> => {
  const data = await request<SessionResponse>("post", "session", {
    data: { login: loginName, password },
    authMode: "none",
  });
  storeSession(data);
  return data.user;
};

/** "Who am I" (restores a session on app start; refreshes first when only a refresh token is stored). */
export const getSession = async (): Promise<SessionUser> => {
  const data = await request<{ user: SessionUser }>("get", "session");
  return data.user;
};

/** DELETE /session with the refresh token, then clear storage whatever the answer. Never throws. */
export const logout = async (): Promise<void> => {
  const refreshToken = getRefreshToken();
  try {
    if (refreshToken) {
      await api.delete("session", {
        headers: { "X-Refresh-Token": refreshToken },
        authMode: "none",
        timeout: REFRESH_TIMEOUT_MS,
      });
    }
  } catch {
    /* the server side is best effort; the local session is discarded regardless */
  } finally {
    endSession("logout");
  }
};

// --- users ---

export const getProfile = (username: string) =>
  request<ProfileResponse>("get", `users/${seg(username)}`);

export const searchUsers = (query: string) =>
  request<UserSearchResponse>("get", "users", { params: { query } });

export const setUserRole = (userId: number, role: AssignableRole) =>
  request<void>("patch", `users/${seg(userId)}/role`, { data: { role } });

export const setUserPrograms = (
  userId: number,
  programs: { development: boolean; volunteer: boolean },
) =>
  request<ProgramsResponse>("put", `users/${seg(userId)}/programs`, { data: programs });

// --- spaces and presence ---

export const listSpaces = () => request<Space[]>("get", "spaces");

export const getMySpace = () => request<Space>("get", "me/space");

export const setMySpace = (spaceId: number) =>
  request<Space>("put", "me/space", { data: { space_id: spaceId } });

export const getPresence = (spaceId: number | string) =>
  request<PresenceResponse>("get", `spaces/${seg(spaceId)}/presence`);

export const signInUser = (spaceId: number | string, username: string) =>
  request<void>("post", `spaces/${seg(spaceId)}/presence`, { data: { username } });

export const signOutUser = (spaceId: number | string, username: string) =>
  request<void>("delete", `spaces/${seg(spaceId)}/presence/${seg(username)}`);

export const loadSpaceDashboard = async (): Promise<SpaceDashboardData> => {
  const [mySpace, spaces] = await Promise.all([getMySpace(), listSpaces()]);
  const presence = await getPresence(mySpace.id);
  return {
    space: presence.space,
    users: presence.users,
    spaces,
    current_user: presence.current_user,
  };
};

// --- rfid ---

export const listUnlinkedCards = () =>
  request<UnlinkedCard[]>("get", "rfid_cards", { params: { linked: false } });

export const linkRfid = (userId: number, cardNumber: string) =>
  request<void>("put", `users/${seg(userId)}/rfid`, {
    data: { card_number: cardNumber },
  });

export const unlinkRfid = (userId: number) =>
  request<void>("delete", `users/${seg(userId)}/rfid`);

export const tapRfid = (cardNumber: string, spaceId: number) =>
  request<RfidTapResponse>("post", "rfid_taps", {
    data: { card_number: cardNumber, space_id: spaceId },
  });

// --- training sessions ---

export const listTrainingSessions = () =>
  request<TrainingSession[]>("get", "training_sessions");

export const getTrainingSessionOptions = (spaceId?: number | string | null) =>
  request<TrainingSessionOptions>("get", "training_session_options", {
    params: spaceId != null ? { space_id: spaceId } : undefined,
  });

export const createTrainingSession = (body: CreateTrainingSessionRequest) =>
  request<{ id: number }>("post", "training_sessions", { data: body });

export const certifyTrainingSession = (sessionId: number | string) =>
  request<{ certified: boolean }>(
    "post",
    `training_sessions/${seg(sessionId)}/certifications`,
  );

// --- printers ---

export const listPrinterTypes = () =>
  request<PrinterType[]>("get", "printer_types", { params: { include: "printers" } });

export const assignPrinter = (printerId: number, userId: number | "clear") =>
  request<void>("post", `printers/${seg(printerId)}/assignments`, {
    data: { user_id: userId },
  });

export const listPrinterIssues = () =>
  request<PrinterIssueRecord[]>("get", "printer_issues");

export const resolvePrinterIssue = (issueId: number) =>
  request<void>("patch", `printer_issues/${seg(issueId)}`, { data: { active: false } });

// --- shifts ---

/**
 * `truncated` is the `X-Truncated: true` header (shifts.md): the server cut the list at its cap.
 * Browsers only expose it cross-origin when the API sends Access-Control-Expose-Headers.
 */
export const listShifts = async (
  spaceId: number | string,
  range: { start: Date; end: Date },
  userId?: number,
): Promise<{ events: ShiftEvent[]; truncated: boolean }> => {
  const { data, headers } = await requestWithHeaders<ShiftEvent[]>(
    "get",
    `spaces/${seg(spaceId)}/shifts`,
    {
      params: {
        start: range.start.toISOString(),
        end: range.end.toISOString(),
        ...(userId ? { user_id: userId } : {}),
      },
    },
  );
  return { events: data, truncated: headers["x-truncated"] === "true" };
};

// --- public ---

/** Public; a signed-in caller's name/email come from the account (token attached when there is one). */
export const sendSupportRequest = (body: SupportRequest) =>
  request<{ status: "accepted" }>("post", "support_requests", {
    data: body,
    authMode: "optional",
  });

export const listContactInfos = () =>
  request<ContactInfo[]>("get", "contact_infos", { authMode: "none" });
