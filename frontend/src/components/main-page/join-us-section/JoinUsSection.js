import React, { memo, useCallback } from 'react';
import { Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ActionButton from '../action-button/ActionButton';
import './JoinUsSection.css';

const SECTION_CONTENT = {
  title: 'Приєднуйтесь до нас',
  description: 'Якщо ви бажаєте стати частиною нашої команди волонтерів або маєте ресурси, якими готові поділитися, зареєструйтесь на нашій платформі. Разом ми зможемо зробити більше для тих, хто потребує допомоги.',
  buttonText: 'Зареєструватися'
};

const JoinUsSection = () => {
  const navigate = useNavigate();
  
  const handleRegisterClick = useCallback(() => {
    navigate('/register');
  }, [navigate]);

  return (
    <Box className="join-us-box">
      <Typography 
        variant="h4" 
        component="h2" 
        gutterBottom 
        className="join-us-section-title"
      >
        {SECTION_CONTENT.title}
      </Typography>
      
      <Typography 
        variant="body1" 
        component="p" 
        className="join-us-section-text"
      >
        {SECTION_CONTENT.description}
      </Typography>
      
      <Box className="action-button-container">
        <ActionButton 
          text={SECTION_CONTENT.buttonText}
          onClick={handleRegisterClick}
          color="primary"
          size="large"
        />
      </Box>
    </Box>
  );
};

export default memo(JoinUsSection); 