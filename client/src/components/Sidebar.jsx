import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <Box className="sidebar-container">
      <div className="sidebar-header">My Forum</div>
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/')}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/trending')}>
            <ListItemIcon>
              <TrendingUpIcon />
            </ListItemIcon>
            <ListItemText primary="Trending" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/new')}>
            <ListItemIcon>
              <NewReleasesIcon />
            </ListItemIcon>
            <ListItemText primary="New" />
          </ListItemButton>
        </ListItem>
        {/* ...additional sections and links... */}
      </List>
      <Divider />
      <div className="sidebar-footer">© 2023 My Forum</div>
    </Box>
  );
};

export default Sidebar;