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
let accessTokenExpiresAt = 0;

const storage = {
  get(key: string): string | null {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* storage blocked: the session just will not survive a reload */
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

export const REFRESH_TOKEN_STORAGE_KEY = REFRESH_KEY;

export const removeLegacyStorage = () => storage.remove(LEGACY_TOKEN_KEY);

export const getAccessToken = () => accessToken;

/** True when there is no access token, or it expires within `marginMs`. */
export const accessTokenNeedsRefresh = (marginMs = 30_000) =>
  !accessToken || accessTokenExpiresAt - Date.now() < marginMs;

export const getRefreshToken = () => storage.get(REFRESH_KEY);

const pickUser = (user: SessionUser): SessionUser => ({
  id: user.id,
  username: user.username,
  name: user.name,
  role: user.role,
});

export const getStoredUser = (): SessionUser | null => {
  const raw = storage.get(USER_KEY);
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

/** Store the pair returned by login/refresh. The old refresh token is replaced at once. */
export const storeSession = (session: SessionResponse) => {
  accessToken = session.access_token;
  const expires = Date.parse(session.access_token_expires_at);
  accessTokenExpiresAt = Number.isNaN(expires) ? Date.now() + 14 * 60_000 : expires;
  storage.set(REFRESH_KEY, session.refresh_token);
  storage.set(USER_KEY, JSON.stringify(pickUser(session.user)));
};

export const clearSession = () => {
  accessToken = null;
  accessTokenExpiresAt = 0;
  storage.remove(REFRESH_KEY);
  storage.remove(USER_KEY);
  storage.remove(LEGACY_TOKEN_KEY);
};
