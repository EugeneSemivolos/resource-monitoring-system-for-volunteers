import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Tabs, Tab } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import './Navigation.css';

const Navigation = ({ navValue, setNavValue }) => {
  const handleLogoClick = () => {
    setNavValue(0);
  };

  return (
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
        <IconButton color="inherit" className="user-icon">
          <AccountCircleIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation; 