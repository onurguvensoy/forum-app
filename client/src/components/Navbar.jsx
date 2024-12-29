import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search,
  NotificationsNone,
  Chat,
  AccountCircle,
  KeyboardArrowDown,
  Person,
  Article,
  Logout
} from '@mui/icons-material';
import axios from 'axios';
import { useUser } from '../utils/userProvider';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { username, setUsername } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [cookies, removeCookie] = useCookies(['token']);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleProfileClick = () => {
    if (username) {
      navigate(`/profile/${username}`);
      setShowDropdown(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Call logout endpoint
      await axios.post(
        "https://forum-app-backend-om3r.onrender.com/api/auth/logout",
        {},
        { withCredentials: true }
      );

      // Clean up client-side state regardless of server response
      removeCookie("token", { path: "/" });
      setUsername("");
      setShowDropdown(false);
      
      // Navigate to login page
      navigate("/login");
      
      toast.success("Logged out successfully", {
        theme: "dark",
        style: {
          backgroundColor: "#1a1a1a",
          border: "1px solid #10b981",
          borderRadius: "4px",
          color: "#ffffff",
        }
      });
    } catch (error) {
      console.error("Logout error:", error);
      
      // Still clean up client-side state even if server request fails
      removeCookie("token", { path: "/" });
      setUsername("");
      setShowDropdown(false);
      navigate("/login");
      
      toast.error("Error during logout, but you've been logged out", {
        theme: "dark",
        style: {
          backgroundColor: "#1a1a1a",
          border: "1px solid #dc2626",
          borderRadius: "4px",
          color: "#ffffff",
        }
      });
    }
  };

  useEffect(() => {
    // Handle clicks outside search results and dropdown
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length > 0) {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/api/entries/search?query=${encodeURIComponent(query)}`,
          { withCredentials: true }
        );
        setSearchResults(data);
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
      }
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleResultClick = (result) => {
    if (result.type === 'user') {
      navigate(`/profile/${result.username}`);
    } else {
      navigate(`/entry/${result._id}`);
    }
    setSearchQuery('');
    setShowResults(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          ForWhom
        </Link>

        <div className="navbar-search" ref={searchRef}>
          <Search className="search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search entries and users..."
            aria-label="Search"
          />
          {showResults && searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((result) => (
                <div
                  key={result._id}
                  className="search-result-item"
                  onClick={() => handleResultClick(result)}
                >
                  {result.type === 'user' ? (
                    <>
                      <Person className="result-icon" />
                      <div className="result-content">
                        <span className="result-title">@{result.username}</span>
                        <span className="result-subtitle">User Profile</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <Article className="result-icon" />
                      <div className="result-content">
                        <span className="result-title">{result.title}</span>
                        <span className="result-subtitle">by @{result.username}</span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="navbar-actions">
          <Link to="/community-chat" className="navbar-action" title="Community Chat">
            <Chat />
          </Link>
          
          <button className="navbar-action" title="Notifications">
            <NotificationsNone />
            <span className="notification-badge">3</span>
          </button>

          <div className="account-dropdown" ref={dropdownRef}>
            <button 
              className="account-button" 
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="avatar">{username ? username[0].toUpperCase() : 'G'}</div>
              <span>{username || 'Guest'}</span>
              <KeyboardArrowDown />
            </button>

            {showDropdown && (
              <div className="dropdown-menu">
                <button className="dropdown-item" onClick={handleProfileClick}>
                  <Person />
                  <span>Profile</span>
                  <div className="profile-bubble">View your profile</div>
                </button>
                <button className="dropdown-item" onClick={handleLogout}>
                  <Logout />
                  <span>Logout</span>
                  <div className="logout-bubble">Sign out of your account</div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
