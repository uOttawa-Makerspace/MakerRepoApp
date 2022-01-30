import './index.css';
import Login from "./screens/Login";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {HashRouter as Router, Switch} from "react-router-dom";
import Home from "./screens/Home";
import Navbar from "./components/Navbar";
import Profile from "./screens/Profile";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';
import PublicRoute from "./utils/PublicRoute";
import PrivateRoute from "./utils/PrivateRoute";
import {getToken, removeUserSession, setUserSession} from "./utils/Common";
import Help from "./screens/Help";
import * as HTTPRequest from "./utils/HTTPRequests";
import {LoggedInContext} from "./utils/Contexts";

function App() {

    const [authLoading, setAuthLoading] = useState(true);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        const token = getToken();
        if (!token) {
            return;
        }

        HTTPRequest.get('check_signed_in').then(
            response => {
                setUserSession(response.token, response.user);
                setLoggedIn(true);
            }
        ).catch((error) => {
            console.error(error);
            setLoggedIn(false);
            removeUserSession();
        });

        setAuthLoading(false);
    }, []);

    if (authLoading && getToken()) {
        return <div className="content">Checking Authentication...</div>
    }

    return (
        <Router>
            <LoggedInContext.Provider value={{loggedIn, setLoggedIn}}>
                <div className="main">
                    <div className="content">
                        <Switch>
                            <PublicRoute path="/login" component={Login}/>
                            <PublicRoute path="/help" component={Help} />
                            <PrivateRoute path="/profile/:username">
                                <Profile/>
                            </PrivateRoute>
                            <PrivateRoute path="/" component={Home}/>
                        </Switch>
                    </div>
                    { loggedIn &&
                        <Navbar/>
                    }
                </div>
            </LoggedInContext.Provider>
        </Router>
    );
}

export default App;
