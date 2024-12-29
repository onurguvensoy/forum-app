import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../utils/userProvider';
import { 
  Home,
  TrendingUp,
  Add,
  Chat,
  Bookmark,
  Settings,
  Notifications,
  Person,
  ExploreOutlined,
  DarkMode
} from '@mui/icons-material';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username } = useUser();

  const menuItems = [
    { icon: <Home />, text: 'Home', path: '/' },
    { icon: <TrendingUp />, text: 'Trending', path: '/trending' },
    { icon: <ExploreOutlined />, text: 'Explore', path: '/explore' },
    { icon: <Chat />, text: 'Community Chat', path: '/community-chat' },
    { icon: <Bookmark />, text: 'Bookmarks', path: '/bookmarks' },
    { icon: <Notifications />, text: 'Notifications', path: '/notifications' },
    { icon: <Person />, text: 'Profile', path: `/profile/${username}` },
  ];

  const isActive = (path) => {
    if (path.startsWith('/profile/')) {
      return location.pathname.startsWith('/profile/');
    }
    return location.pathname === path;
  };

  return (
    <div className="sidebar">
      <div className="menu-items">
        {menuItems.map((item) => (
          <button
            key={item.path}
            className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
            disabled={item.path.includes('/profile/') && !username}
          >
            {item.icon}
            <span>{item.text}</span>
          </button>
        ))}
      </div>

      <div className="sidebar-footer">
        <button className="menu-item">
          <Settings />
          <span>Settings</span>
        </button>
        <button className="menu-item">
          <DarkMode />
          <span>Theme</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;