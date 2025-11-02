import "./index.scss";
import React, { useEffect, useState } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import useErrorBoundary from "use-error-boundary";
import Login from "./screens/Login";
import Home from "./screens/Home";
import Navbar from "./components/Navbar";
import Profile from "./screens/Profile";
import "bootstrap/dist/js/bootstrap";
import PrivateRoute from "./utils/PrivateRoute";
import { getToken, removeUserSession, setUserSession } from "./utils/Common";
import Help from "./screens/Help";
import * as HTTPRequest from "./utils/HTTPRequests";
import { LoggedInContext } from "./utils/Contexts";
import theme from "./theme";

function App() {
  const [authLoading, setAuthLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<Record<string, any> | null>(null);

  const airbrake = HTTPRequest.airbrake();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setAuthLoading(false);
      return;
    }

    HTTPRequest.get("check_signed_in")
      .then((response) => {
        if (response.signed_in === "true") {
          setUserSession(response.token, response.user);
          setLoggedIn(true);
          setAuthLoading(false);
          setUser(response.user);
        } else {
          setLoggedIn(false);
          setAuthLoading(false);
          removeUserSession();
        }
      })
      .catch((error) => {
        console.error(error);
        setLoggedIn(false);
        setAuthLoading(false);
        removeUserSession();
      });
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