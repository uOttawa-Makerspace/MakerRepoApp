import React, {useContext} from "react";
import {UserContext} from "../contexts/UserContext";

const Logout = () => {

    const { user, setUser } = useContext(UserContext);

    const handleLogout = (e) => {
        fetch('http://localhost:3000/logout', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }}).then((response) => response.json().then((async data => {
                setUser(null);
            })
        )).catch((error) => {
            console.error(error);
        });
    }

    return (
        <div>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
};

export default Logout;