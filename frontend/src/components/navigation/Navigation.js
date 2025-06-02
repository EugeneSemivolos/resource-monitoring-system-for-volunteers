import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Tabs, Tab, Avatar, Menu, MenuItem } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginModal from '../auth/LoginModal';
import { useUser } from '../../contexts/UserContext';
import './Navigation.css';

const Navigation = ({ navValue, setNavValue, loginModalOpen, setLoginModalOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useUser();
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  // Встановлюємо значення навігації в false, якщо ми на сторінці профілю
  React.useEffect(() => {
    if (location.pathname === '/profile' && setNavValue) {
      setNavValue(false);
    }
  }, [location.pathname, setNavValue]);

  const getPhotoUrl = () => {
    if (!user || !user.photo) {
      return null;
    }
    if (user.photo.startsWith('http')) {
      return user.photo;
    }
    return `http://localhost:8000${user.photo}`;
  };
  
  const handleLogoClick = () => {
    setNavValue && setNavValue(0);
    navigate('/');
  };
  
  const handleAvatarClick = (event) => {
    if (isAuthenticated) {
      setAnchorEl(event.currentTarget);
    } else {
      setLoginModalOpen(true);
    }
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleLoginClose = () => {
    setLoginModalOpen(false);
  };
  
  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
    setNavValue && setNavValue(0);
  };
  
  const handleProfile = () => {
    navigate('/profile');
    handleMenuClose();
  };

  const handleTabChange = (event, newValue) => {
    setNavValue(newValue);
    switch (newValue) {
      case 0:
        navigate('/');
        break;
      case 1:
        navigate('/resources');
        break;
      case 2:
        navigate('/volunteers');
        break;
      case 3:
        navigate('/mission');
        break;
      default:
        break;
    }
  };

  return (
    <>
      <AppBar position="fixed" className="app-bar">
        <Toolbar>
          <Typography 
            variant="h6" 
            onClick={handleLogoClick}
            className="site-title"
          >
            Система моніторингу ресурсів
          </Typography>
          <Tabs 
            value={navValue} 
            onChange={handleTabChange}
            aria-label="navigation tabs"
            className="navigation-tabs"
          >
            <Tab label="Головна" />
            <Tab label="Ресурси" />
            <Tab label="Волонтери" />
            <Tab label="Про проєкт" />
          </Tabs>
          <IconButton 
            color="inherit" 
            className="user-icon"
            onClick={handleAvatarClick}
          >
            {isAuthenticated && user ? (
              <Avatar 
                alt={`${user.first_name} ${user.last_name}`} 
                src={getPhotoUrl()}
                className="user-avatar"
              >
                <AccountCircleIcon />
              </Avatar>
            ) : (
              <AccountCircleIcon />
            )}
          </IconButton>
        </Toolbar>
      </AppBar>
      
      {/* меню користувача */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          '& .MuiPaper-root': {
            marginTop: '8px',
            minWidth: '200px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          }
        }}
        disableScrollLock={true}
      >
        <MenuItem onClick={handleProfile}>Мій профіль</MenuItem>
        <MenuItem onClick={handleLogout}>Вийти</MenuItem>
      </Menu>
      
      <LoginModal 
        open={loginModalOpen} 
        onClose={handleLoginClose} 
      />
    </>
  );
};

export default Navigation; 