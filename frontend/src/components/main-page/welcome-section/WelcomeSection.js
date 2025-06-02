import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Typography, Box } from '@mui/material';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import { useNavigate } from 'react-router-dom';
import ActionButton from '../action-button/ActionButton';
import './WelcomeSection.css';

const WELCOME_CONTENT = {
  welcomeText: 'Ласкаво просимо',
  middleText: 'до',
  systemTitle: 'Системи моніторингу ресурсів!',
  subtitle: 'Об\'єднуємо волонтерів та ресурси для ефективної допомоги',
  buttonText: 'Почати роботу'
};

const WelcomeSection = ({ setNavValue }) => {
  const navigate = useNavigate();

  const handleStartWork = useCallback(() => {
    setNavValue(1); // 1 is the index of "Ресурси" tab
    navigate('/resources');
  }, [navigate, setNavValue]);

  return (
    <Box className="welcome-container">
      <VolunteerActivismIcon 
        className="welcome-icon"
        fontSize="large"
        color="primary"
      />
      
      <Box className="welcome-content">
        <Typography 
          variant="h4" 
          component="h2" 
          className="welcome-title"
        >
          {WELCOME_CONTENT.welcomeText}
        </Typography>
        
        <Typography 
          variant="h5" 
          component="span" 
          className="welcome-middle"
        >
          {WELCOME_CONTENT.middleText}
        </Typography>
        
        <Typography 
          variant="h2" 
          component="h1" 
          className="welcome-system-title"
        >
          {WELCOME_CONTENT.systemTitle}
        </Typography>
      </Box>
      
      <Typography 
        variant="h5" 
        component="p"
        color="text.secondary" 
        className="welcome-subtitle"
      >
        {WELCOME_CONTENT.subtitle}
      </Typography>
      
      <Box className="welcome-button-container">
        <ActionButton 
          text={WELCOME_CONTENT.buttonText}
          onClick={handleStartWork} 
          color="primary"
          size="large"
        />
      </Box>
    </Box>
  );
};

WelcomeSection.propTypes = {
  setNavValue: PropTypes.func.isRequired
};

export default memo(WelcomeSection); 