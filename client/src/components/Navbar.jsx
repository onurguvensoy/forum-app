import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { 
  AppBar, Toolbar, IconButton, Typography, InputBase, Button,
  Box, Menu, MenuItem, Avatar, Divider
} from '@mui/material';
import { 
  Search as SearchIcon,
  AccountCircle,
  ArrowDropDown,
  Notifications,
  Chat
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import './Navbar.css';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '20px',
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '40ch',
    },
  },
}));

const Navbar = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies(['token']);
  const [anchorEl, setAnchorEl] = useState(null);
  const isAuthenticated = Boolean(cookies.token);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    removeCookie('token');
    navigate('/login');
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#1a1a1a' }}>
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ display: { xs: 'none', sm: 'block' }, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          ForWhom
        </Typography>

        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search ForWhom..."
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>

        <Box sx={{ flexGrow: 1 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isAuthenticated && (
            <>
              <IconButton 
                color="inherit" 
                size="large"
                onClick={() => navigate('/community-chat')}
                title="Community Chat"
              >
                <Chat />
              </IconButton>
              <IconButton color="inherit" size="large">
                <Notifications />
              </IconButton>
            </>
          )}
          
          {isAuthenticated ? (
            <>
              <Button
                color="inherit"
                onClick={handleMenu}
                startIcon={<AccountCircle />}
                endIcon={<ArrowDropDown />}
                sx={{ ml: 1, textTransform: 'none' }}
              >
                Account
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                sx={{ mt: 1 }}
              >
                <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
                <MenuItem onClick={() => navigate('/settings')}>Settings</MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                onClick={() => navigate('/login')}
                sx={{ textTransform: 'none' }}
              >
                Login
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate('/signup')}
                sx={{ textTransform: 'none' }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
