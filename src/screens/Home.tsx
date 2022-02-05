import React, {useEffect, useState} from "react";
import '../utils/env_variables'
import env_variables from "../utils/env_variables";
import SpaceDashboard from "./SpaceDashboard";
import {getUser, removeUserSession, setUserSession} from "../utils/Common";
import SpaceHours from "./SpaceHours";
import axios from "axios";
import * as HTTPRequest from "../utils/HTTPRequests";

function Home(props: { history: string[]; }) {

    const [user, setUser] = useState<{[key: string]: string} | null>(null);

    useEffect(() => {
        setUser(getUser());
    }, [])

    const handleLogout = () => {
        HTTPRequest.get('logout').then(
            () => {
                removeUserSession();
                props.history.push('/login');
            }
        ).catch((error) => {
            console.error(error);
        });
    }

    return (
        <div>
            {user &&
                <>
                    <h1>Hello {user.name}</h1>
                    {user.role === 'admin'
                        ? <SpaceDashboard/>
                        : <SpaceHours/>
                    }
                    <button className="btn btn-primary" onClick={handleLogout}>Logout</button>
                </>
            }
        </div>
    )
};

export default Home;