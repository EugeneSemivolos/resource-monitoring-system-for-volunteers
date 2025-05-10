import React from 'react';
import { Typography } from '@mui/material';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import './Mission.css';

const Mission = () => (
  <div className="mission-section">
    <div className="mission-header">
      <VolunteerActivismIcon className="mission-icon" />
      <Typography variant="h4" className="mission-title">
        Наша місія
      </Typography>
    </div>
    <Typography className="mission-content">
      Ми прагнемо створити ефективну платформу для координації волонтерської діяльності та розподілу ресурсів. 
      Наша система допомагає з'єднати тих, хто потребує допомоги, з тими, хто готовий її надати.
    </Typography> 
  </div>
);

export default Mission; 