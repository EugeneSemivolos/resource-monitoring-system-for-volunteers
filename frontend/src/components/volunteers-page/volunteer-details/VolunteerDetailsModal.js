import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Chip,
  Divider,
  IconButton,
  Avatar
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import TelegramIcon from '@mui/icons-material/Telegram';
import PersonIcon from '@mui/icons-material/Person';
import './VolunteerDetailsModal.css';

const VolunteerDetailsModal = ({ volunteer, open, onClose }) => {
  if (!volunteer) return null;

  const getPhotoUrl = () => {
    if (!volunteer.photo) {
      return null;
    }
    if (volunteer.photo.startsWith('http')) {
      return volunteer.photo;
    }
    return `http://localhost:8000${volunteer.photo}`;
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = null;
  };

  const formatPhone = (phone) => {
    if (!phone) return 'не вказано';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `+38 (${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6,8)}-${cleaned.slice(8)}`;
    }
    return phone;
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      className="volunteer-details-modal"
      PaperProps={{
        sx: {
          maxWidth: '500px',
          width: '100%',
          position: 'relative'
        }
      }}
    >
      <IconButton
        aria-label="close"
        onClick={onClose}
        className="close-button"
      >
        <CloseIcon />
      </IconButton>

      <div className="volunteer-details-header">
        <Typography variant="h4" className="header-title">
          Картка волонтера
        </Typography>
      </div>

      <DialogTitle className="modal-title">
        <Box className="volunteer-header-content">
          <Box className="volunteer-name-container">
            <Typography variant="h5" component="div" className="modal-volunteer-last-name">
              {volunteer.last_name}
            </Typography>
            <Typography variant="h6" component="div" className="modal-volunteer-first-name">
              {volunteer.first_name}
            </Typography>
            {volunteer.middle_name && (
              <Typography variant="h6" component="div" className="modal-volunteer-middle-name">
                {volunteer.middle_name}
              </Typography>
            )}
          </Box>
          <Avatar 
            src={getPhotoUrl()} 
            alt={`${volunteer.last_name} ${volunteer.first_name}`}
            className="volunteer-avatar"
            onError={handleImageError}
          >
            <PersonIcon />
          </Avatar>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Divider className="section-divider" />

        {/* Організація */}
        {volunteer.organization && (
          <Box className="organization-section">
            <Typography>
              <strong>Організація:</strong> {volunteer.organization}
            </Typography>
          </Box>
        )}

        <Divider className="section-divider" />

        {/* Навички */}
        {volunteer.skills && (
          <Box className="skills-section">
            <Typography variant="h6" gutterBottom>
              Навички
            </Typography>
            <Box className="skills-list">
              {volunteer.skills.split(',').map((skill, index) => (
                <Chip 
                  key={index} 
                  label={skill.trim()} 
                  className="skill-chip"
                />
              ))}
            </Box>
          </Box>
        )}

        <Divider className="section-divider" />

        {/* Опис */}
        {volunteer.description && (
          <Box className="description-section">
            <Typography variant="h6" gutterBottom>
              Опис
            </Typography>
            <Typography>{volunteer.description}</Typography>
          </Box>
        )}

        <Divider className="section-divider" />

        {/* Контакти */}
        <Box className="contact-info">
          <Typography variant="h6" gutterBottom>
            Контактна інформація
          </Typography>
          <Box className="contact-item">
            <EmailIcon />
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Email
              </Typography>
              <Typography>{volunteer.email}</Typography>
            </Box>
          </Box>
          <Box className="contact-item">
            <PhoneIcon />
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Телефон
              </Typography>
              <Typography>{formatPhone(volunteer.phone)}</Typography>
            </Box>
          </Box>
          <Box className="contact-item">
            <TelegramIcon />
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Telegram
              </Typography>
              <Typography>
                {volunteer.telegram_id ? `${volunteer.telegram_id}` : 'не вказано'}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider className="section-divider" />

        {/* Системна інформація */}
        <Box className="additional-info">
          
          <Typography>
            <strong>Дата реєстрації:</strong> {new Date(volunteer.registration_date).toLocaleDateString()}
          </Typography>
          <Typography>
            <strong>Останній вхід:</strong> {volunteer.last_login ? new Date(volunteer.last_login).toLocaleString('uk-UA', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            }) : 'не вказано'}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default VolunteerDetailsModal; 