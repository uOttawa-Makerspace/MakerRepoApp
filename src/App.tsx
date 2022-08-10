import "./index.css";
import React, { useEffect, useState } from "react";
import { HashRouter as Router, Switch } from "react-router-dom";
import useErrorBoundary from "use-error-boundary";
import { Notifier } from "@airbrake/browser";
import Login from "./screens/Login";
import Home from "./screens/Home";
import Navbar from "./components/Navbar";
import Profile from "./screens/Profile";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";
import PublicRoute from "./utils/PublicRoute";
import PrivateRoute from "./utils/PrivateRoute";
import { getToken, removeUserSession, setUserSession } from "./utils/Common";
import Help from "./screens/Help";
import * as HTTPRequest from "./utils/HTTPRequests";
import { LoggedInContext } from "./utils/Contexts";

function App() {
  const [authLoading, setAuthLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const airbrake = new Notifier({
    projectId: 441678,
    projectKey: "b19323e1288e612e00fc65acf1369c5c",
  });

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setAuthLoading(false);
      return;
    }

    HTTPRequest.get("check_signed_in")
      .then((response) => {
        setUserSession(response.token, response.user);
        setLoggedIn(true);
        setAuthLoading(false);
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
    return <div className="content">Checking Authentication...</div>;
  }

  return (
    <ErrorBoundary>
      <Router>
        {/* eslint-disable-next-line max-len,react/jsx-no-constructed-context-values */}
        <LoggedInContext.Provider value={{ loggedIn, setLoggedIn }}>
          <div className="main">
            <div className="content">
              <Switch>
                <PublicRoute path="/login" component={Login} />
                <PublicRoute path="/help" component={Help} />
                <PrivateRoute path="/profile/:username">
                  <Profile />
                </PrivateRoute>
                <PrivateRoute path="/" component={Home} />
              </Switch>
            </div>
            {loggedIn && <Navbar />}
          </div>
        </LoggedInContext.Provider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
