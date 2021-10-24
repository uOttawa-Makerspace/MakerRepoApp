import React, {useContext, useState} from "react";
import {UserContext} from "../contexts/UserContext";

const Header = () => {
    const { user, setUser } = useContext(UserContext);

    return (
        <div>
           This is the header
        </div>
    )
}

export default Header;