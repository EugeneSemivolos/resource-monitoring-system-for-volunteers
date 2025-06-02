import React, { memo } from 'react';
import { Typography, Box } from '@mui/material';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import './Mission.css';

const MISSION_CONTENT = {
  title: 'Наша місія',
  description: `Ми прагнемо створити ефективну платформу для координації волонтерської діяльності та розподілу ресурсів. 
    Наша система допомагає з'єднати тих, хто потребує допомоги, з тими, хто готовий її надати.`
};

const Mission = () => (
  <Box className="mission-section">
    <Box className="mission-header">
      <VolunteerActivismIcon 
        className="mission-icon"
        fontSize="large"
        color="primary"
      />
      <Typography 
        variant="h4" 
        component="h2"
        className="mission-title"
      >
        {MISSION_CONTENT.title}
      </Typography>
    </Box>
    <Typography 
      variant="body1"
      component="p" 
      className="mission-content"
    >
      {MISSION_CONTENT.description}
    </Typography>
  </Box>
);

export default memo(Mission); 