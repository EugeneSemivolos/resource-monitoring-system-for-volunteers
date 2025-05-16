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

// Константи
const API_BASE_URL = 'http://localhost:8000';
const DEFAULT_AVATAR = '/images/default_avatar.png';

const VolunteerCard = ({ volunteer }) => {
  // Допоміжні функції
  const getFullName = () => {
    const lastName = volunteer.last_name || '';
    const firstName = volunteer.first_name || '';
    const middleName = volunteer.middle_name ? ` ${volunteer.middle_name}` : '';
    return `${lastName} ${firstName}${middleName}`;
  };

  const getPhotoUrl = () => {
    if (!volunteer.photo) {
      return DEFAULT_AVATAR;
    }
    // Якщо URL вже повний (починається з http), використовуємо його як є
    if (volunteer.photo.startsWith('http')) {
      return volunteer.photo;
    }
    // Інакше додаємо базовий URL
    return `${API_BASE_URL}${volunteer.photo}`;
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = DEFAULT_AVATAR;
  };

  const parseSkills = (skills) => {
    if (!skills) return [];
    if (typeof skills !== 'string') return [skills];
    return skills.split(',').map(skill => skill.trim());
  };

  // Обробка даних
  const fullName = getFullName();
  const photoUrl = getPhotoUrl();
  const skills = parseSkills(volunteer.skills);

  // Функції відображення
  const renderHeader = () => (
    <div className="volunteer-card-header">
      {renderAvatar()}
      <div className="volunteer-name-container">
        <Typography variant="h6" component="h2" className="volunteer-name">
          {fullName}
        </Typography>
      </div>
    </div>
  );

  const renderAvatar = () => {
    return (
      <Avatar 
        src={photoUrl} 
        alt={fullName} 
        className="volunteer-avatar"
        onError={handleImageError}
      >
        <PersonIcon />
      </Avatar>
    );
  };

  const renderOrganization = () => {
    if (!volunteer.organization) return null;
    
    return (
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
    );
  };

  const renderSkills = () => {
    if (!volunteer.skills) return null;
    
    return (
      <Box className="volunteer-info-section">
        <Box className="volunteer-info-label">
          <BuildIcon className="volunteer-info-icon" />
          <Typography variant="subtitle2" className="volunteer-info-title">
            Навички:
          </Typography>
        </Box>
        <Box className="volunteer-skills">
          {skills.map((skill, index) => (
            <Chip 
              key={index} 
              label={skill} 
              size="small" 
              className="volunteer-skill-chip"
            />
          ))}
        </Box>
      </Box>
    );
  };

  const renderDescription = () => {
    if (!volunteer.description) return null;
    
    return (
      <Box className="volunteer-info-section volunteer-description">
        <Typography variant="subtitle2" className="volunteer-info-title">
          Опис:
        </Typography>
        <Typography variant="body2" className="volunteer-info-description">
          {volunteer.description}
        </Typography>
      </Box>
    );
  };

  // Основний рендер
  return (
    <Card className="volunteer-card">
      <CardContent>
        {renderHeader()}
        <Divider className="volunteer-divider" />
        {renderOrganization()}
        {renderSkills()}
        {renderDescription()}
      </CardContent>
    </Card>
  );
};

export default VolunteerCard; 