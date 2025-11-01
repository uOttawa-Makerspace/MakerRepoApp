import React from "react";
import { NavLink } from "react-router-dom";
import { 
    Home, 
    Person, 
    HelpOutline,
    HomeOutlined,
    PersonOutline
} from '@mui/icons-material';
import './Navbar.scss';

interface NavbarProps {
  user: Record<string, any>;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  return (
    <nav className="bottom-navbar">
      <div className="bottom-navbar-container">
        <NavLink 
          to="/" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          aria-label="Home"
        >
          {({ isActive }) => (
            <>
              {isActive ? <Home className="nav-icon" /> : <HomeOutlined className="nav-icon" />}
              <span className="nav-label">Home</span>
            </>
          )}
        </NavLink>

        <NavLink 
          to={`/profile/${user?.username || ''}`}
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          aria-label="Profile"
        >
          {({ isActive }) => (
            <>
              {isActive ? <Person className="nav-icon" /> : <PersonOutline className="nav-icon" />}
              <span className="nav-label">Profile</span>
            </>
          )}
        </NavLink>

        <NavLink 
          to="/help" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          aria-label="Help"
        >
          <HelpOutline className="nav-icon" />
          <span className="nav-label">Help</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;