import "./index.scss";
import { useEffect, useRef, useState } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import useErrorBoundary from "use-error-boundary";
import Login from "./screens/Login/index";
import Home from "./screens/Home";
import Navbar from "./components/Navbar";
import Profile from "./screens/Profile/index";
import "bootstrap/dist/js/bootstrap";
import PrivateRoute from "./utils/PrivateRoute";
import Help from "./screens/Help/index";
import { getSession } from "./api/endpoints";
import { endSession, endTabSession, onSessionEnded } from "./api/client";
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
    if (!getRefreshToken()) {
      setAuthLoading(false);
    } else {
      // GET /api/v1/session (refreshes the access token first, since it only lives in memory).
      getSession()
        .then((sessionUser) => {
          setUser(sessionUser);
          setLoggedIn(true);
        })
        .catch(() => {
          // A 401 has already cleared the session; a network/5xx failure keeps the stored refresh
          // token so a reload can try again.
          setLoggedIn(false);
        })
        .finally(() => setAuthLoading(false));
    }

    return () => {
      unsubscribe();
      window.removeEventListener("storage", onStorage);
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
