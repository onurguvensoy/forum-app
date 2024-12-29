import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search,
  NotificationsNone,
  Chat,
  AccountCircle,
  KeyboardArrowDown
} from '@mui/icons-material';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          ForWhom
        </Link>

        <div className="navbar-search">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search ForWhom..."
            aria-label="Search"
          />
        </div>

        <div className="navbar-actions">
          <Link to="/community-chat" className="navbar-action" title="Community Chat">
            <Chat />
          </Link>
          
          <button className="navbar-action" title="Notifications">
            <NotificationsNone />
            <span className="notification-badge">3</span>
          </button>

          <button className="account-button">
            <div className="avatar">O</div>
            <span>Account</span>
            <KeyboardArrowDown />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
