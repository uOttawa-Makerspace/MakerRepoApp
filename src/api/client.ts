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
  getAccessToken,
  getRefreshToken,
  storeSession,
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

export type SessionEndReason = "expired" | "logout";
type SessionEndListener = (reason: SessionEndReason) => void;
const sessionEndListeners = new Set<SessionEndListener>();

/** Subscribe to "the session is over" (refresh failed, logout, signed out in another tab). */
export const onSessionEnded = (listener: SessionEndListener) => {
  sessionEndListeners.add(listener);
  return () => {
    sessionEndListeners.delete(listener);
  };
};

/** Clear stored tokens and tell the UI. */
export const endSession = (reason: SessionEndReason) => {
  clearSession();
  sessionEndListeners.forEach((listener) => listener(reason));
};

// --- instance ---

export const api: AxiosInstance = axios.create({
  baseURL: `${EnvVariables.api_url}/api/v1`,
  withCredentials: false,
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

const doRefresh = async (): Promise<SessionResponse> => {
  let lastConflict: ApiError | null = null;

  for (let attempt = 0; attempt < MAX_REFRESH_ATTEMPTS; attempt += 1) {
    // Re-read every time: another tab may have rotated the token while we waited.
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      endSession("expired");
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
        { authMode: "none" },
      );
      storeSession(data);
      return data;
    } catch (caught) {
      const error = toApiError(caught);
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
        endSession("expired");
      }
      // Network errors, 429 and 5xx are transient: keep the session, let the caller fail.
      throw error;
    }
  }

  throw (
    lastConflict ??
    new ApiError(409, "refresh_in_progress", "Session refresh is busy. Please retry.")
  );
};

let inflightRefresh: Promise<SessionResponse> | null = null;

/** Refresh the token pair. Concurrent callers share one request. */
export const refreshSession = (): Promise<SessionResponse> => {
  if (!inflightRefresh) {
    inflightRefresh = withCrossTabLock(doRefresh).finally(() => {
      inflightRefresh = null;
    });
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

      if (error.response?.status === 401 && config && authed) {
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

/** Typed request: resolves with the body, rejects with ApiError. */
export const request = async <T>(
  method: "get" | "post" | "put" | "patch" | "delete",
  path: string,
  options: AxiosRequestConfig = {},
): Promise<T> => {
  try {
    const response = await api.request<T>({ method, url: path, ...options });
    return response.data;
  } catch (caught) {
    const error = toApiError(caught);
    reportUnexpected(error, method, path);
    throw error;
  }
};

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
