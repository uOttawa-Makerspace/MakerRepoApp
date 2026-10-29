import type { SessionResponse, SessionUser } from "./types";

/**
 * Token and user storage.
 *
 * - The access token (15 min) lives in memory only.
 * - The refresh token is the one persisted secret (localStorage), as session.md prescribes.
 * - Of the user we keep only id, username, name and role.
 *
 * Nothing in here logs a token.
 */

const REFRESH_KEY = "refresh_token";
const USER_KEY = "user";
// The pre-/api/v1 14-day JWT. The new API rejects it, so it is dead weight (and a secret) in storage.
const LEGACY_TOKEN_KEY = "token";

let accessToken: string | null = null;
/** performance.now() reading at which the access token counts as expired (see tokenLifetimeMs). */
let accessTokenExpiresAt = 0;

/** Monotonic local clock: immune to the device wall clock being wrong or being changed. */
const monotonicNow = () => performance.now();

/** Access token lifetime when the response gives nothing usable (session.md: 15 minutes). */
const DEFAULT_LIFETIME_MS = 15 * 60_000;
const MAX_LIFETIME_MS = 60 * 60_000;

/**
 * How long the access token lives, measured on the SERVER clock only: the JWT's `exp - iat`, or
 * failing that `access_token_expires_at` minus `iat`. Neither is compared with the device clock,
 * so a device that is hours ahead or behind cannot make every request look "expiring" (a refresh
 * per request) or never expiring. The expiry is then anchored at the moment we received the token.
 */
const tokenLifetimeMs = (session: SessionResponse): number => {
  try {
    const payload = session.access_token.split(".")[1];
    const claims = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))) as {
      iat?: unknown;
      exp?: unknown;
    };
    if (typeof claims.iat === "number" && typeof claims.exp === "number") {
      const ms = (claims.exp - claims.iat) * 1000;
      if (ms > 0 && ms <= MAX_LIFETIME_MS) return ms;
    }
    if (typeof claims.iat === "number") {
      const ms = Date.parse(session.access_token_expires_at) - claims.iat * 1000;
      if (ms > 0 && ms <= MAX_LIFETIME_MS) return ms;
    }
  } catch {
    /* not a decodable JWT: use the documented default */
  }
  return DEFAULT_LIFETIME_MS;
};

/**
 * Session generation. Bumped whenever the session is cleared or a new one is started by a login.
 * A refresh remembers the generation it started in and may only store its result if that is still
 * the current one, so a slow refresh can neither undo a logout nor overwrite a newer login.
 */
let sessionGeneration = 0;

export const getSessionGeneration = () => sessionGeneration;

/**
 * localStorage is best effort: reads and writes can throw (blocked site data, quota, private mode).
 * `get` returns undefined when storage is unreadable, null when the key is absent.
 */
const storage = {
  get(key: string): string | null | undefined {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return undefined;
    }
  },
  set(key: string, value: string): boolean {
    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  },
  remove(key: string) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  },
};

/**
 * The latest refresh token, in memory. The server rotates it on every refresh and revokes the old
 * one, so losing the newest value (e.g. because the localStorage write threw) would end the
 * session at the next refresh. This is the source of truth for THIS tab whenever persisting it
 * failed (`persistFailed`); otherwise localStorage is, so rotations by other tabs are picked up.
 */
let memRefreshToken: string | null = null;
let persistFailed = false;

export const REFRESH_TOKEN_STORAGE_KEY = REFRESH_KEY;
export const USER_STORAGE_KEY = USER_KEY;

export const removeLegacyStorage = () => storage.remove(LEGACY_TOKEN_KEY);

export const getAccessToken = () => accessToken;

/** True when there is no access token, or it expires within `marginMs`. */
export const accessTokenNeedsRefresh = (marginMs = 30_000) =>
  !accessToken || accessTokenExpiresAt - monotonicNow() < marginMs;

/**
 * Set when another tab signed in as a different user and this tab stepped aside (detachSession).
 * While set, this tab must not use the refresh token in storage (it now belongs to the other user).
 * A login in this tab clears it.
 */
let detached = false;

export const getRefreshToken = (): string | null => {
  if (detached) return null;
  if (persistFailed) return memRefreshToken;
  const stored = storage.get(REFRESH_KEY);
  // Unreadable storage: fall back to what this tab holds. Absent (null): logged out elsewhere.
  return stored === undefined ? memRefreshToken : stored;
};

const pickUser = (user: SessionUser): SessionUser => ({
  id: user.id,
  username: user.username,
  name: user.name,
  role: user.role,
});

const parseUser = (raw: string | null | undefined): SessionUser | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.id === "number" && parsed.username) {
      return pickUser(parsed);
    }
  } catch {
    /* fall through */
  }
  return null;
};

let memUser: SessionUser | null = null;

/** What is persisted in localStorage right now (so what another tab wrote), or null. */
export const readPersistedUser = (): SessionUser | null =>
  parseUser(storage.get(USER_KEY));

/** The signed-in user of this tab (storage normally; memory when persisting failed). */
export const getStoredUser = (): SessionUser | null => {
  if (detached) return null;
  if (persistFailed) return memUser;
  const raw = storage.get(USER_KEY);
  return raw === undefined ? memUser : parseUser(raw);
};

const writeSession = (session: SessionResponse) => {
  accessToken = session.access_token;
  // Anchored at receipt on the monotonic clock. Latency makes this slightly late; the 30 s margin
  // and the 401 -> refresh -> retry path cover that.
  accessTokenExpiresAt = monotonicNow() + tokenLifetimeMs(session);
  // Memory first, then best-effort persistence. A failed write keeps the session working in this
  // tab (it just will not survive a reload or reach other tabs).
  memRefreshToken = session.refresh_token;
  memUser = pickUser(session.user);
  const persisted =
    storage.set(REFRESH_KEY, session.refresh_token) &&
    storage.set(USER_KEY, JSON.stringify(memUser));
  persistFailed = !persisted;
  if (persistFailed) {
    // Race: the server just rotated the refresh token, so whatever storage still holds is the OLD,
    // already revoked one. Another tab or a reload would replay it, and once the 30 s grace has
    // passed the server treats that as theft and revokes the whole token family (logout
    // everywhere). A stale USER_KEY would likewise show the wrong identity. So remove both: other
    // tabs see the removal and fall back to a clean login, a reload lands on the login screen.
    // This tab keeps working from memory (persistFailed). Storage events never fire in the tab that made the change, so this tab
    // does not log itself out through App's storage listener (only OTHER tabs do, which is intended).
    // If remove() fails as well there is
    // nothing more we can do.
    storage.remove(REFRESH_KEY);
    storage.remove(USER_KEY);
  }
};

/** Store the pair returned by a LOGIN. Starts a new session generation (invalidates stale refreshes). */
export const storeSession = (session: SessionResponse) => {
  sessionGeneration += 1;
  detached = false;
  writeSession(session);
};

/**
 * Store the pair returned by a REFRESH that started in `generation`. Returns false, storing
 * nothing, when the session was cleared or replaced meanwhile (the result is stale).
 */
export const storeRefreshedSession = (
  session: SessionResponse,
  generation: number,
): boolean => {
  if (generation !== sessionGeneration) return false;
  writeSession(session);
  return true;
};

/**
 * Forget this tab's session WITHOUT touching storage. Used when another tab replaced the stored
 * session with another user's: clearing storage here would sign that other user out.
 */
export const detachSession = () => {
  sessionGeneration += 1;
  accessToken = null;
  accessTokenExpiresAt = 0;
  memRefreshToken = null;
  memUser = null;
  persistFailed = false;
  detached = true;
};

/**
 * Clear this tab's session and, normally, the stored one.
 *
 * In a DETACHED tab storage belongs to the user who signed in in another tab, so only memory is
 * cleared there. Race: a request issued after the detach gets a 401 and ends the session as
 * "expired"; removing REFRESH_KEY/USER_KEY then deleted the other user's valid session and
 * logged them out in their tab. The tab stays detached (a login clears that, storeSession).
 */
export const clearSession = () => {
  const touchStorage = !detached;
  sessionGeneration += 1;
  accessToken = null;
  accessTokenExpiresAt = 0;
  memRefreshToken = null;
  memUser = null;
  persistFailed = false;
  if (!touchStorage) return;
  storage.remove(REFRESH_KEY);
  storage.remove(USER_KEY);
  storage.remove(LEGACY_TOKEN_KEY);
};
