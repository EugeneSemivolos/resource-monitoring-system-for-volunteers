import React from 'react';
import { Typography, Box } from '@mui/material';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import ActionButton from '../action-button/ActionButton';
import './WelcomeSection.css';

const WelcomeSection = () => {
  return (
    <Box className="welcome-container">
      <VolunteerActivismIcon className="welcome-icon"/>
      
      <Box className="welcome-content">
        <Typography className="welcome-title">
          Ласкаво просимо
        </Typography>
        
        <Typography className="welcome-middle">
          до
        </Typography>
        
        <Typography variant="h2" component="h1" className="welcome-system-title">
          Системи моніторингу ресурсів!
        </Typography>
      </Box>
      
      <Typography variant="h5" color="text.secondary" className="welcome-subtitle">
        Об'єднуємо волонтерів та ресурси для ефективної допомоги
      </Typography>
      
      <Box className="welcome-button-container">
        <ActionButton 
          text="Почати роботу" 
          onClick={() => console.log('Початок роботи')} 
        />
      </Box>
    </Box>
  );
};

export default WelcomeSection; 