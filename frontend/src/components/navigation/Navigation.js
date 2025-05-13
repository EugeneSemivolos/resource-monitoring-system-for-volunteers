import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Tabs, Tab, Avatar, Menu, MenuItem } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../auth/LoginModal';
import { useUser } from '../../contexts/UserContext';
import './Navigation.css';

const Navigation = ({ navValue, setNavValue, loginModalOpen, setLoginModalOpen }) => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useUser();
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  const handleLogoClick = () => {
    setNavValue(0);
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
  };
  
  const handleProfile = () => {
    // Тут можна додати навігацію до сторінки профіля
    console.log('Navigate to profile');
    handleMenuClose();
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
            onChange={(event, newValue) => {
              setNavValue(newValue);
            }} 
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
                alt={`${user.firstName} ${user.lastName}`} 
                src={user.photoUrl} 
                className="user-avatar"
              />
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