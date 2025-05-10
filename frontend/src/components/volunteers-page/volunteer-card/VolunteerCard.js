import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Avatar
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import './VolunteerCard.css';

const VolunteerCard = ({ volunteer }) => {
  return (
    <Card className="volunteer-card">
      <CardContent>
        <div className="volunteer-card-header">
          <Avatar className="volunteer-avatar">
            <PersonIcon />
          </Avatar>
          <Typography variant="h6" component="h2" className="volunteer-name">
            {volunteer.name}
          </Typography>
        </div>
        
        {/* Пустая карточка - наполнение будет добавлено позже */}
        <div className="volunteer-placeholder">
          <Typography 
            variant="body2" 
            color="text.secondary" 
            className="volunteer-placeholder-text"
          >
            Інформація про волонтера буде доступна незабаром
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

export default VolunteerCard; 