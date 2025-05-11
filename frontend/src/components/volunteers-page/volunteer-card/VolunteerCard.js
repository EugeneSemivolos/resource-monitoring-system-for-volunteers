import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Chip,
  Divider
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import BuildIcon from '@mui/icons-material/Build';
import './VolunteerCard.css';

const VolunteerCard = ({ volunteer }) => {
  // Формируем полное имя
  const fullName = `${volunteer.last_name || ''} ${volunteer.first_name || ''}${volunteer.middle_name ? ' ' + volunteer.middle_name : ''}`;

  // Формируем URL для фото или используем заглушку
  const photoUrl = volunteer.photo && volunteer.photo.length > 0
    ? `http://localhost:8000${volunteer.photo}`
    : null;

  return (
    <Card className="volunteer-card">
      <CardContent>
        <div className="volunteer-card-header">
          {photoUrl ? (
            <Avatar 
              src={photoUrl} 
              alt={fullName} 
              className="volunteer-avatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/150';
              }}
            />
          ) : (
            <Avatar className="volunteer-avatar">
              <PersonIcon />
            </Avatar>
          )}
          <div className="volunteer-name-container">
            <Typography variant="h6" component="h2" className="volunteer-name">
              {fullName}
            </Typography>
          </div>
        </div>
        
        <Divider className="volunteer-divider" />
        
        {/* Организация */}
        {volunteer.organization && (
          <Box className="volunteer-info-section volunteer-info-row">
            <Box className="volunteer-info-label-inline">
              <BusinessIcon className="volunteer-info-icon" />
              <Typography variant="subtitle2" className="volunteer-info-title">
                Організація:
              </Typography>
            </Box>
            <Typography variant="body2" className="volunteer-organization-value">
              {volunteer.organization}
            </Typography>
          </Box>
        )}
        
        {/* Навыки */}
        {volunteer.skills && (
          <Box className="volunteer-info-section">
            <Box className="volunteer-info-label">
              <BuildIcon className="volunteer-info-icon" />
              <Typography variant="subtitle2" className="volunteer-info-title">
                Навички:
              </Typography>
            </Box>
            <Box className="volunteer-skills">
              {typeof volunteer.skills === 'string' ? 
                volunteer.skills.split(',').map((skill, index) => (
                  <Chip 
                    key={index} 
                    label={skill.trim()} 
                    size="small" 
                    className="volunteer-skill-chip"
                  />
                )) : 
                <Typography variant="body2">
                  {volunteer.skills}
                </Typography>
              }
            </Box>
          </Box>
        )}
        
        {/* Описание */}
        {volunteer.description && (
          <Box className="volunteer-info-section volunteer-description">
            <Typography variant="subtitle2" className="volunteer-info-title">
              Опис:
            </Typography>
            <Typography variant="body2" className="volunteer-info-description">
              {volunteer.description}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default VolunteerCard; 