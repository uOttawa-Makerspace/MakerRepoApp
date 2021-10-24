import React, {useContext, useState} from "react";
import {UserContext} from "../contexts/UserContext";
import Logout from "./Logout";
import '../env_variables'
import env_variables from "../env_variables";
import SpaceDashboard from "./SpaceDashboard";

const Home = () => {

    const { user, setUser } = useContext(UserContext);
    const [ badge, setBadge ] = useState(null);

    const getBadges = () => {
        fetch(`${env_variables.config.api_url}/badges/populate_badge_list?user_id=1`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }}).then(response => response.json().then((data => {
                setBadge(JSON.stringify(data))
            })
        )).catch((error) => {
            console.error(error);
        });
    }

    return (
        <div>
            <h1>Hello {user.name}</h1>
            <button onClick={getBadges}>Get badges</button>
            { badge !== null &&
                <p>{ badge }</p>
            }
            <SpaceDashboard />
            <Logout/>
        </div>
    )
};

export default Home;