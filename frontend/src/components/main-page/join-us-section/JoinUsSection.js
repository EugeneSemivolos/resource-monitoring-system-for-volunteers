import React from 'react';
import { Typography, Box } from '@mui/material';
import ActionButton from '../action-button/ActionButton';
import './JoinUsSection.css';

const JoinUsSection = () => {
  const handleRegisterClick = () => {
    console.log('Відкрити форму реєстрації');
  };

  return (
    <Box className="join-us-box">
      <Typography variant="h4" gutterBottom className="section-title">
        Приєднуйтесь до нас
      </Typography>
      
      <Typography variant="body1" className="section-text center-text">
        Якщо ви бажаєте стати частиною нашої команди волонтерів або маєте ресурси, якими готові поділитися, зареєструйтесь на нашій платформі. Разом ми зможемо зробити більше для тих, хто потребує допомоги.
      </Typography>
      
      <Box className="action-button-container">
        <ActionButton 
          text="Зареєструватися" 
          onClick={handleRegisterClick}
        />
      </Box>
    </Box>
  );
};

export default JoinUsSection; 