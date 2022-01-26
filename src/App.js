import './index.css';
import Login from "./screens/Login";
import axios from 'axios';
import React, {useEffect, useState} from "react";
import {HashRouter as Router, Switch} from "react-router-dom";
import Home from "./screens/Home";
import Navbar from "./components/Navbar";
import env_variables from "./utils/env_variables";
import Profile from "./screens/Profile";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';
import PublicRoute from "./utils/PublicRoute";
import PrivateRoute from "./utils/PrivateRoute";
import {getToken, removeUserSession, setUserSession} from "./utils/Common";
import Help from "./screens/Help";

function App() {

    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const token = getToken();
        if (!token) {
            return;
        }

        axios.get(`${env_variables.config.api_url}/check_signed_in`, {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${window.localStorage.getItem('token')}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(response => {
            setUserSession(response.data.token, response.data.user);
            setAuthLoading(false);
        }).catch(error => {
            console.log(error)
            removeUserSession();
            setAuthLoading(false);
        });
    }, []);

    if (authLoading && getToken()) {
        return <div className="content">Checking Authentication...</div>
    }

    return (
        <Router>
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
                <Navbar/>
            </div>
        </Router>
    );
}

export default App;
