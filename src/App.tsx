import "./index.scss";
import { useEffect, useRef, useState } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Button from "@mui/material/Button";
import useErrorBoundary from "use-error-boundary";
import Login from "./screens/Login/index";
import Home from "./screens/Home";
import Navbar from "./components/Navbar";
import Profile from "./screens/Profile/index";
import "bootstrap/dist/js/bootstrap";
import PrivateRoute from "./utils/PrivateRoute";
import Help from "./screens/Help/index";
import { getSession } from "./api/endpoints";
import { ApiError, endSession, endTabSession, onSessionEnded } from "./api/client";
import {
  REFRESH_TOKEN_STORAGE_KEY,
  USER_STORAGE_KEY,
  getRefreshToken,
  readPersistedUser,
  removeLegacyStorage,
} from "./api/tokens";
import type { SessionUser } from "./api/types";
import { airbrake as getAirbrake } from "./utils/airbrake";
import { LoggedInContext } from "./utils/Contexts";
import theme from "./theme";

function App() {
  const [authLoading, setAuthLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [startupError, setStartupError] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const retryNowRef = useRef<() => void>(() => {});

  const airbrake = getAirbrake();

  // The storage handler below lives for the whole app lifetime; it needs the current user.
  const userRef = useRef<SessionUser | null>(null);
  userRef.current = user;

  useEffect(() => {
    // The session is over (refresh failed, logout, signed out in another tab): drop to the login screen.
    const unsubscribe = onSessionEnded(() => {
      setLoggedIn(false);
      setUser(null);
    });

    const onStorage = (event: StorageEvent) => {
      if (event.key === REFRESH_TOKEN_STORAGE_KEY && event.newValue === null) {
        endSession("logout");
        return;
      }
      // Another tab logged in (or restored a session) and wrote a new user/token. Same user: this
      // is just a rotation, nothing to do. A different user: do NOT silently adopt that identity
      // (this tab would keep showing the old user's screens while acting as the new one); end
      // this tab's session instead. The other tab's stored session is left untouched.
      if (
        event.key === USER_STORAGE_KEY ||
        (event.key === REFRESH_TOKEN_STORAGE_KEY && event.newValue !== null)
      ) {
        const current = userRef.current;
        const stored = readPersistedUser();
        if (current && stored && stored.id !== current.id) endTabSession();
      }
    };
    window.addEventListener("storage", onStorage);

    removeLegacyStorage();
    return () => {
      unsubscribe();
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // Restore the session on start. GET /api/v1/session refreshes the access token first (it only
  // lives in memory). Only a real 401 / no stored session goes to login; network errors, timeouts,
  // 429 and 5xx keep the stored refresh token and show a retry state instead of looking like a logout.
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let attempt = 0;

    const restore = () => {
      if (cancelled) return;
      if (!getRefreshToken()) {
        setStartupError(false);
        setAuthLoading(false);
        return;
      }
      setRetrying(true);
      getSession()
        .then((sessionUser) => {
          if (cancelled) return;
          setUser(sessionUser);
          setLoggedIn(true);
          setStartupError(false);
          setAuthLoading(false);
        })
        .catch((error: unknown) => {
          if (cancelled) return;
          const sessionGone =
            (error instanceof ApiError && error.status === 401) || !getRefreshToken();
          if (sessionGone) {
            // The client has already cleared the session.
            setLoggedIn(false);
            setStartupError(false);
            setAuthLoading(false);
            return;
          }
          setStartupError(true);
          setAuthLoading(false);
          // Exponential backoff with jitter: 2 s, 4 s, ... capped at 30 s.
          const delay =
            Math.min(30_000, 2_000 * 2 ** attempt) * (0.75 + Math.random() * 0.5);
          attempt += 1;
          timer = setTimeout(restore, delay);
        })
        .finally(() => {
          if (!cancelled) setRetrying(false);
        });
    };

    retryNowRef.current = () => {
      if (timer) clearTimeout(timer);
      restore();
    };
    restore();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  const { ErrorBoundary } = useErrorBoundary({
    onDidCatch: (error, errorInfo) => {
      airbrake.notify({
        error,
        params: { info: errorInfo },
      });
    },
  });

  if (startupError) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="content" role="alert">
          <p>Can&apos;t reach MakerRepo, retrying…</p>
          <Button
            variant="contained"
            disabled={retrying}
            onClick={() => retryNowRef.current()}
          >
            Retry now
          </Button>
        </div>
      </ThemeProvider>
    );
  }

  if (authLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="content">Checking Authentication...</div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <Router>
          {/* eslint-disable-next-line max-len,react/jsx-no-constructed-context-values */}
          <LoggedInContext.Provider value={{ loggedIn, setLoggedIn }}>
            <div className="main">
              <div className="content">
                <Routes>
                  <Route
                    path="/login"
                    element={<Login setUser={(userProp) => setUser(userProp)} />}
                  />
                  <Route path="/help" element={<Help />} />
                  <Route
                    path="/profile/:username"
                    element={
                      <PrivateRoute>
                        <Profile />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/"
                    element={
                      <PrivateRoute>
                        <Home user={user} />
                      </PrivateRoute>
                    }
                  />
                </Routes>
              </div>
              {loggedIn && user && <Navbar user={user} />}
            </div>
          </LoggedInContext.Provider>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
