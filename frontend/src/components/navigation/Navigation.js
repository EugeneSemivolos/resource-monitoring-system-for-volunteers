import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Tabs, Tab } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import './Navigation.css';

const Navigation = ({ navValue, setNavValue }) => {
  const handleLogoClick = () => {
    setNavValue(0);
  };

  return (
    <AppBar position="fixed" sx={{ 
      zIndex: 1100,
      backgroundColor: 'rgba(25, 118, 210, 0.95)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <Toolbar>
        <Typography 
          variant="h6" 
          onClick={handleLogoClick}
          sx={{ 
            flexGrow: 1,
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8
            },
            transition: 'opacity 0.2s'
          }}
        >
          Система моніторингу ресурсів
        </Typography>
        <Tabs 
          value={navValue} 
          onChange={(event, newValue) => {
            setNavValue(newValue);
          }} 
          aria-label="navigation tabs"
          sx={{
            '& .MuiTab-root': {
              color: 'white',
              fontSize: '1rem',
              textTransform: 'none',
              minWidth: 100,
            },
            '& .Mui-selected': {
              fontSize: '1.1rem',
              fontWeight: 'bold',
              color: 'white !important',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'white',
              height: '3px',
            },
          }}
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