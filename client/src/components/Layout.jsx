import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Trends from './Trends';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isCreateEntry = location.pathname === '/create-entry';
  const useEntriesSection = isHomePage || isCreateEntry || location.pathname === '/community-chat';

  return (
    <div>
      <div className="navbar">
        <Navbar />
      </div>
      <div className="hero">
        <div className="sidebar">
          <Sidebar />
        </div>
        <div className={useEntriesSection ? "entries-section" : "main-content"}>
          {children}
        </div>
        <div className="trends-section">
          <Trends />
        </div>
      </div>
    </div>
  );
};

export default Layout; 