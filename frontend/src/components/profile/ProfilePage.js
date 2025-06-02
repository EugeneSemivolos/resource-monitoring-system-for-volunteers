import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Avatar,
  Chip,
  Divider,
  Paper,
  Button,
  Skeleton,
  CircularProgress,
  Alert
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import TelegramIcon from '@mui/icons-material/Telegram';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import BuildIcon from '@mui/icons-material/Build';
import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useUser } from '../../contexts/UserContext';
import { volunteerService } from '../../services/api';
import EditProfileForm from './EditProfileForm';
import './ProfilePage.css';

const formatDate = (dateString) => {
  if (!dateString) return 'не вказано';
  return new Date(dateString).toLocaleString('uk-UA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const ProfilePage = () => {
  const { user, updateUser } = useUser();
  const [volunteerData, setVolunteerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const fetchVolunteerData = useCallback(async (isManualRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user || !user.id) {
        throw new Error('Не вдалося визначити ID користувача');
      }

      const response = await volunteerService.getVolunteerById(user.id);
      setVolunteerData(response);
    } catch (err) {
      console.error('Помилка при завантаженні даних профілю:', err);
      if (err.response && err.response.status === 404) {
        setError('Профіль не знайдено. Можливо, ви були видалені з системи.');
      } else if (err.response && err.response.status === 401) {
        setError('Необхідно повторно авторизуватися в системі.');
      } else {
        setError('Не вдалося завантажити дані профілю. Спробуйте оновити сторінку.');
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchVolunteerData();
  }, [fetchVolunteerData]);

  const handleManualRefresh = () => {
    fetchVolunteerData(true);
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleEditClose = () => {
    setIsEditModalOpen(false);
  };

  const handleProfileUpdate = (updatedData) => {
    setVolunteerData(updatedData);
    updateUser(updatedData);
  };

  if (!user) {
    return (
      <Container maxWidth="md" className="profile-container">
        <Typography variant="h5" align="center">
          Для перегляду профілю необхідно авторизуватися
        </Typography>
      </Container>
    );
  }

  if (loading && !volunteerData) {
    return (
      <Container maxWidth="md" className="profile-container">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" className="profile-container">
        <Alert 
          severity="error" 
          action={
            <Button
              color="inherit"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={handleManualRefresh}
            >
              Спробувати ще раз
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  if (!volunteerData) {
    return (
      <Container maxWidth="md" className="profile-container">
        <Alert severity="warning">
          Дані профілю не знайдено
        </Alert>
      </Container>
    );
  }

  const getPhotoUrl = () => {
    if (!volunteerData.photo) {
      return null;
    }
    if (volunteerData.photo.startsWith('http')) {
      return volunteerData.photo;
    }
    return `http://localhost:8000${volunteerData.photo}`;
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = null;
  };

  const parseSkills = (skills) => {
    if (!skills) return [];
    if (typeof skills === 'string') {
      return skills.split(',').map(skill => skill.trim()).filter(skill => skill);
    }
    return Array.isArray(skills) ? skills : [];
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
    <Container maxWidth="md" className="profile-container">
      <Paper elevation={3} className="profile-paper">
        <Box className="profile-header">
          <Typography variant="h4" className="profile-title">
            Мій профіль
          </Typography>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            className="edit-profile-button"
            onClick={handleEditClick}
          >
            Редагувати профіль
          </Button>
        </Box>

        <Divider className="section-divider" />

        <Box className="profile-main-info">
          <Box className="profile-avatar-container">
            <Avatar
              src={getPhotoUrl()}
              onError={handleImageError}
              className="profile-avatar"
            >
              <PersonIcon />
            </Avatar>
          </Box>

          <Box className="profile-name-container">
            <Typography variant="h5" className="profile-last-name">
              {volunteerData.last_name || 'Прізвище не вказано'}
            </Typography>
            <Typography variant="h6" className="profile-first-name">
              {volunteerData.first_name || 'Ім\'я не вказано'}
            </Typography>
            {volunteerData.middle_name && (
              <Typography variant="subtitle1" className="profile-middle-name">
                {volunteerData.middle_name}
              </Typography>
            )}
          </Box>
        </Box>

        <Box className="profile-details">
          <Box className="profile-section">
            <Typography variant="h6" gutterBottom>
              Контактна інформація
            </Typography>
            <Box className="contact-info">
              <Box className="contact-item">
                <EmailIcon />
                <Typography>{volunteerData.email}</Typography>
              </Box>
              <Box className="contact-item">
                <PhoneIcon />
                <Typography>{formatPhone(volunteerData.phone)}</Typography>
              </Box>
              {volunteerData.telegram_id && (
                <Box className="contact-item">
                  <TelegramIcon />
                  <Typography>{volunteerData.telegram_id}</Typography>
                </Box>
              )}
            </Box>
          </Box>

          {volunteerData.organization && (
            <Box className="profile-section">
              <Typography variant="h6" gutterBottom>
                Організація
              </Typography>
              <Box className="organization-info">
                <BusinessIcon />
                <Typography>{volunteerData.organization}</Typography>
              </Box>
            </Box>
          )}

          {volunteerData.skills && (
            <Box className="profile-section">
              <Typography variant="h6" gutterBottom>
                Навички
              </Typography>
              <Box className="skills-container">
                <BuildIcon />
                <Box className="skills-chips">
                  {parseSkills(volunteerData.skills).map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      className="skill-chip"
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          )}

          {volunteerData.description && (
            <Box className="profile-section">
              <Typography variant="h6" gutterBottom>
                Про мене
              </Typography>
              <Typography className="profile-description">
                {volunteerData.description}
              </Typography>
            </Box>
          )}

          <Box className="profile-section">
            <Typography variant="h6" gutterBottom>
              Системна інформація
            </Typography>
            <Box className="system-info">
              <Box className="info-item">
                <AccessTimeIcon />
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Дата реєстрації
                  </Typography>
                  <Typography>
                    {formatDate(volunteerData.registration_date)}
                  </Typography>
                </Box>
              </Box>
              <Box className="info-item">
                <AccessTimeIcon />
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Останній вхід
                  </Typography>
                  <Typography>
                    {formatDate(volunteerData.last_login)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>

      <EditProfileForm
        open={isEditModalOpen}
        onClose={handleEditClose}
        volunteerData={volunteerData}
        onUpdate={handleProfileUpdate}
      />
    </Container>
  );
};

export default ProfilePage;