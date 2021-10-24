import './index.css';
import Login from "./components/Login";
import React, {useEffect, useMemo, useState} from "react";
import {UserContext} from "./contexts/UserContext";
import { HashRouter as Router, Route } from "react-router-dom";
import Home from "./components/Home";
import Header from "./components/Header";
import env_variables from "./env_variables";

function App() {

  const [user, setUser] = useState(null);
  const userProvider = useMemo(() => ({ user, setUser }), [user, setUser]);

    const check_signed_in = () => {
        fetch(`${env_variables.config.api_url}/check_signed_in`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }}).then(response => response.json().then((data => {
                console.log(data);
                return data === {"signed_in": "true"};
            })
        )).catch((error) => {
            console.error(error);
        });
    }

    useEffect(() => {
        if (check_signed_in) {
            setUser(JSON.parse(window.localStorage.getItem("user")));
        } else {
            setUser(null);
        }
    }, []);

    useEffect(() => {
        window.localStorage.setItem("user", JSON.stringify(user));
    }, [user]);

  return (
    <Router>
      <div>
        <UserContext.Provider value={userProvider}>
            <Header />
            { user == null ?
                <Route path="/" exact component={Login} />
            :
                <>
                    <Route path="/" exact component={Home} />
                </>

            }
        </UserContext.Provider>
      </div>
    </Router>
  );
}

export default App;
