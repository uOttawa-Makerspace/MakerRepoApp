import React from "react";
import {NavLink} from 'react-router-dom';

const Navbar = () => {
    return (
        <div className="bottom-nav">
            <NavLink to="" className="bottom-nav-item active">
                <i className="material-icons home-icon">
                    home
                </i>
                <span className="bottom-nav-text">Home</span>
            </NavLink>
            <NavLink to="/profile/Art29" className="bottom-nav-item">
                <i className="material-icons person-icon">
                    person
                </i>
                <span className="bottom-nav-text">Profile</span>
            </NavLink>
            <NavLink to="/help" className="bottom-nav-item">
                <i className="material-icons person-info">
                    help
                </i>
                <span className="bottom-nav-text">Help</span>
            </NavLink>
        </div>
    )
}

export default Navbar;