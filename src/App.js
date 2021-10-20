import './index.css';
import Login from "./components/Login";
import React, {useEffect, useMemo, useState} from "react";
import {UserContext} from "./contexts/UserContext";
import { HashRouter as Router, Route } from "react-router-dom";
import Home from "./components/Home";

function App() {

  const [user, setUser] = useState(null);
  const userProvider = useMemo(() => ({ user, setUser }), [user, setUser]);

    useEffect(() => {
        setUser(JSON.parse(window.localStorage.getItem("user")));
    }, []);

    useEffect(() => {
        window.localStorage.setItem("user", JSON.stringify(user));
    }, [user]);



  return (
    <Router basename ="/makerepo-react-app">
      <div>
        <UserContext.Provider value={userProvider}>
            { user == null ?
                <Route path="/" exact component={Login} />
            :
                <Route path="/" exact component={Home} />
            }
        </UserContext.Provider>
      </div>
    </Router>
  );
}

export default App;
