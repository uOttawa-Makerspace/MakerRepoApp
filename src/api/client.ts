import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import EnvVariables from "../utils/EnvVariables";
import { airbrake } from "../utils/airbrake";
import {
  accessTokenNeedsRefresh,
  clearSession,
  detachSession,
  getAccessToken,
  getRefreshToken,
  getSessionGeneration,
  storeRefreshedSession,
} from "./tokens";
import type { SessionResponse } from "./types";

/**
 * Axios client for /api/v1.
 *
 * - Bearer access token on every call, no cookies (withCredentials: false).
 * - On a 401 from an authenticated call: ONE refresh, then ONE retry. Concurrent 401s (and
 *   concurrent proactive refreshes) share a single in-flight refresh, and a Web Lock serialises
 *   refreshes across tabs so the single-use refresh token is not replayed.
 * - 409 refresh_in_progress: wait 200-500 ms, re-read the stored refresh token, retry (max 5).
 * - Timeouts: 15 s per request, 10 s for session/refresh. A timed-out refresh is transient (status 0):
 *   no logout, the lock and the shared promise are released, waiting callers get the error.
 * - Failed refresh (401 / nothing stored): session cleared, listeners told, caller gets the error.
 * - Every rejection is an ApiError. Raw axios errors (which carry request headers) are never
 *   logged or sent to Airbrake.
 *
 * Contract: doc/api/v1/session.md.
 */

declare module "axios" {
  interface AxiosRequestConfig {
    /**
     * "required" (default): attach the access token, refresh and retry on 401.
     * "optional": same, but fine without a session (public endpoints that accept a token).
     * "none": never attach a token or refresh (login, refresh, logout).
     */
    authMode?: "required" | "optional" | "none";
    /** @internal */
    _retried?: boolean;
    /** @internal the access token this request was sent with */
    _sentToken?: string | null;
    /** @internal the session generation this request was sent under */
    _generation?: number;
  }
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fields?: Record<string, string[]>;
  readonly details: Record<string, unknown>;

  constructor(
    status: number,
    code: string,
    message: string,
    fields?: Record<string, string[]>,
    details: Record<string, unknown> = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.fields = fields;
    this.details = details;
  }

  /** No HTTP response at all (offline, DNS, CORS). */
  get isNetworkError() {
    return this.status === 0;
  }
}

const toApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) return error;
  if (axios.isAxiosError(error)) {
    const body = error.response?.data as
      | {
          error?: {
            code?: string;
            message?: string;
            fields?: Record<string, string[]>;
          } & Record<string, unknown>;
        }
      | undefined;
    const status = error.response?.status ?? 0;
    if (
      body &&
      typeof body === "object" &&
      body.error &&
      typeof body.error === "object"
    ) {
      const { code, message, fields, ...details } = body.error;
      return new ApiError(
        status,
        code ?? "unknown_error",
        message ?? `Request failed (${status})`,
        fields,
        details,
      );
    }
    if (status === 0 && (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT")) {
      return new ApiError(0, "timeout", "The request timed out");
    }
    return new ApiError(
      status,
      status === 0 ? "network_error" : "unknown_error",
      status === 0 ? "Network error" : `Request failed (${status})`,
    );
  }
  return new ApiError(
    0,
    "unknown_error",
    error instanceof Error ? error.message : "Unknown error",
  );
};

// --- session end notifications ---

export type SessionEndReason = "expired" | "logout" | "replaced";
type SessionEndListener = (reason: SessionEndReason) => void;
const sessionEndListeners = new Set<SessionEndListener>();

/** Subscribe to "the session is over" (refresh failed, logout, signed out in another tab). */
export const onSessionEnded = (listener: SessionEndListener) => {
  sessionEndListeners.add(listener);
  return () => {
    sessionEndListeners.delete(listener);
  };
};

/**
 * Clear stored tokens and tell the UI.
 *
 * `generation` is the session generation the caller was working in. If it is no longer current,
 * the session the caller meant to end is already gone (logged out, expired, replaced by a login,
 * or detached) and whatever is current now is not the caller's to end: do nothing. Race this
 * closes: tab A detaches because tab B logged in as someone else; a refresh queued on the
 * cross-tab lock in A then wakes up, finds no token and used to call endSession("expired"),
 * wiping B's new session from shared storage. (clearSession also refuses to touch storage in a
 * detached tab, as a second line of defence.)
 */
export const endSession = (reason: SessionEndReason, generation?: number) => {
  if (generation !== undefined && generation !== getSessionGeneration()) return;
  clearSession();
  // A refresh still in flight belongs to the session that just ended; nobody may join it.
  inflightRefresh = null;
  sessionEndListeners.forEach((listener) => listener(reason));
};

/**
 * End only THIS tab's session because another tab signed in as someone else. Storage is left alone
 * (it holds the other user's session now); this tab just stops using it and goes to login.
 */
export const endTabSession = () => {
  detachSession();
  inflightRefresh = null;
  sessionEndListeners.forEach((listener) => listener("replaced"));
};

// --- instance ---

const REQUEST_TIMEOUT_MS = 15_000;
/** Shorter: it runs under the cross-tab lock, with up to MAX_REFRESH_ATTEMPTS tries. */
const REFRESH_TIMEOUT_MS = 10_000;

export const api: AxiosInstance = axios.create({
  baseURL: `${EnvVariables.api_url}/api/v1`,
  withCredentials: false,
  // Without a timeout a stalled connection never settles. For session/refresh that would hold the
  // cross-tab lock and the single-flight promise, hanging every request in every tab.
  timeout: REQUEST_TIMEOUT_MS,
  headers: { Accept: "application/json", "Content-Type": "application/json" },
});

// --- refresh (single flight) ---

const REFRESH_LOCK = "makerepo-session-refresh";
const MAX_REFRESH_ATTEMPTS = 5;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const withCrossTabLock = <T>(fn: () => Promise<T>): Promise<T> => {
  const locks = typeof navigator !== "undefined" ? navigator.locks : undefined;
  return locks ? locks.request(REFRESH_LOCK, fn) : fn();
};

const staleSession = () =>
  new ApiError(
    401,
    "session_changed",
    "The session changed while it was being refreshed. Please retry.",
  );

const doRefresh = async (generation: number): Promise<SessionResponse> => {
  let lastConflict: ApiError | null = null;
  // `generation` was captured by refreshSession BEFORE waiting for the cross-tab lock. Capturing
  // it here (after the wait) was the bug: a refresh queued behind the lock while this tab was
  // detached / logged out / replaced by a login read the already-new generation, passed the
  // staleness check below, found no token and ended (and wiped from storage) the NEWER session.
  // If a logout/expiry/login happens while queued or in flight, the generation moves on and this
  // refresh must not store or end anything.

  for (let attempt = 0; attempt < MAX_REFRESH_ATTEMPTS; attempt += 1) {
    if (getSessionGeneration() !== generation) throw staleSession();
    // Re-read every time: another tab may have rotated the token while we waited.
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      endSession("expired", generation);
      throw new ApiError(
        401,
        "invalid_refresh_token",
        "Your session has ended. Please sign in again.",
      );
    }

    try {
      const { data } = await api.post<SessionResponse>(
        "session/refresh",
        { refresh_token: refreshToken },
        { authMode: "none", timeout: REFRESH_TIMEOUT_MS },
      );
      if (!storeRefreshedSession(data, generation)) throw staleSession();
      return data;
    } catch (caught) {
      const error = toApiError(caught);
      if (getSessionGeneration() !== generation) throw staleSession();
      if (error.status === 409 && error.code === "refresh_in_progress") {
        lastConflict = error;
        await sleep(200 + Math.random() * 300);
        continue;
      }
      if (error.status === 401) {
        if (getRefreshToken() !== refreshToken && getRefreshToken()) {
          // Someone stored a newer token meanwhile; use it instead of giving up.
          continue;
        }
        endSession("expired", generation);
      }
      // Network errors, timeouts (status 0), 429 and 5xx are transient: keep the session, release
      // the lock (we leave withCrossTabLock) and reject every waiting caller.
      throw error;
    }
  }

  throw (
    lastConflict ??
    new ApiError(409, "refresh_in_progress", "Session refresh is busy. Please retry.")
  );
};

/** The shared refresh and the session generation it was started in. */
let inflightRefresh: Promise<SessionResponse> | null = null;
let inflightGeneration = -1;

/** Refresh the token pair. Concurrent callers share one request (of the current session only). */
export const refreshSession = (): Promise<SessionResponse> => {
  if (!inflightRefresh || inflightGeneration !== getSessionGeneration()) {
    // Captured before queueing on the lock, see doRefresh.
    const generation = getSessionGeneration();
    inflightGeneration = generation;
    const promise: Promise<SessionResponse> = withCrossTabLock(() =>
      doRefresh(generation),
    ).finally(() => {
      // Only clear our own entry: a newer session may have started its own refresh meanwhile.
      if (inflightRefresh === promise) inflightRefresh = null;
    });
    inflightRefresh = promise;
  }
  return inflightRefresh;
};

// --- interceptors ---

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  if (config.authMode === "none") return config;

  // Proactive: no/expiring access token but a refresh token is stored (page reload, idle tab).
  if (accessTokenNeedsRefresh() && getRefreshToken()) {
    try {
      await refreshSession();
    } catch (error) {
      if (config.authMode === "optional" && (error as ApiError).status === 401) {
        return config; // anonymous
      }
      throw error;
    }
  }

  const token = getAccessToken();
  config._sentToken = token;
  // Read in the same synchronous step as the token, so the pair always matches.
  config._generation = getSessionGeneration();
  if (token) config.headers.set("Authorization", `Bearer ${token}`);
  else config.headers.delete("Authorization");
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const config = error.config as InternalAxiosRequestConfig | undefined;
      const authed = config && config.authMode !== "none";

      // Race: a request sent under an old session can have its 401 arrive after the user logged
      // out and a new session started (login bumps the generation). That 401 says nothing about
      // the new session: ending it here (or refreshing and retrying the request as the new user)
      // would log the new user out or replay the old user's action under the new identity. Only
      // act on a 401 if the session it was sent under is still the current one.
      const sentGeneration = config?._generation;
      const stale =
        sentGeneration !== undefined && sentGeneration !== getSessionGeneration();

      if (error.response?.status === 401 && config && authed && !stale) {
        if (!config._retried) {
          config._retried = true;
          if (getRefreshToken()) {
            // If another request already rotated the token since this one was sent, just retry.
            if (getAccessToken() === config._sentToken) {
              await refreshSession(); // throws ApiError (session already ended on 401)
            }
            return api.request(config);
          }
        }
        // 401 straight after a fresh token, or nothing to refresh with: the session is dead.
        endSession("expired");
      }
    }
    throw toApiError(error);
  },
);

// --- helpers ---

/** One path segment from user data. Always use this for ids/usernames in paths. */
export const seg = (value: string | number) => encodeURIComponent(String(value));

/** Report only unexpected failures, and only a sanitised summary (no config, headers or bodies). */
const reportUnexpected = (error: ApiError, method: string, path: string) => {
  if (error.status !== 0 && error.status < 500) return;
  const summary = new Error(
    `API ${method.toUpperCase()} ${path.split("?")[0]} failed: ${error.status} ${error.code}`,
  );
  airbrake().notify({
    error: summary,
    params: { status: error.status, code: error.code },
  });
};

type Method = "get" | "post" | "put" | "patch" | "delete";

/** Typed request: resolves with the body and the (lower-cased) response headers. */
export const requestWithHeaders = async <T>(
  method: Method,
  path: string,
  options: AxiosRequestConfig = {},
): Promise<{ data: T; headers: Record<string, string | undefined> }> => {
  try {
    const response = await api.request<T>({ method, url: path, ...options });
    return {
      data: response.data,
      headers: Object.fromEntries(
        Object.entries(response.headers).map(([key, value]) => [
          key.toLowerCase(),
          typeof value === "string" ? value : undefined,
        ]),
      ),
    };
  } catch (caught) {
    const error = toApiError(caught);
    reportUnexpected(error, method, path);
    throw error;
  }
};

/** Typed request: resolves with the body, rejects with ApiError. */
export const request = async <T>(
  method: Method,
  path: string,
  options: AxiosRequestConfig = {},
): Promise<T> => (await requestWithHeaders<T>(method, path, options)).data;

/** Message for a toast: the API's message (plus field errors) for 4xx, `fallback` otherwise. */
export const errorMessage = (error: unknown, fallback: string): string => {
  if (!(error instanceof ApiError) || error.status === 0 || error.status >= 500)
    return fallback;
  const fieldText = error.fields ? Object.values(error.fields).flat().join(", ") : "";
  if (error.status === 422 && fieldText) {
    return error.message ? `${error.message}: ${fieldText}` : fieldText;
  }
  return error.message || fallback;
};
