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
import { useUser } from '../../contexts/UserContext';
import { volunteerService } from '../../services/api';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user } = useUser(); // Використовуємо тільки для перевірки авторизації
  const [volunteerData, setVolunteerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(0);
  
  const fetchVolunteerData = useCallback(async (isManualRefresh = false) => {
    const now = Date.now();
    if (!isManualRefresh && now - lastUpdate < 5000) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Отримуємо ID з локального сховища
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (!currentUser || !currentUser.id) {
        throw new Error('Не вдалося визначити ID користувача');
      }

      const response = await volunteerService.getVolunteerById(currentUser.id);
      setVolunteerData(response);
      setLastUpdate(now);
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
  }, [lastUpdate]);

  useEffect(() => {
    fetchVolunteerData();
  }, [fetchVolunteerData]);

  const handleManualRefresh = () => {
    fetchVolunteerData(true);
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

  const formatDate = (dateString) => {
    if (!dateString) return 'не вказано';
    try {
      return new Date(dateString).toLocaleString('uk-UA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'не вказано';
    }
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
          >
            Редагувати профіль
          </Button>
        </Box>

        <Divider className="section-divider" />

        <Box className="profile-main-info">
          <Box className="profile-name-container">
            <Typography variant="h5" className="profile-last-name">
              {volunteerData.last_name || 'Прізвище не вказано'}
            </Typography>
            <Typography variant="h6" className="profile-first-name">
              {volunteerData.first_name || 'Ім\'я не вказано'}
            </Typography>
            {volunteerData.middle_name && (
              <Typography variant="h6" className="profile-middle-name">
                {volunteerData.middle_name}
              </Typography>
            )}
          </Box>
          <Avatar 
            src={getPhotoUrl()} 
            alt={`${volunteerData.first_name || ''} ${volunteerData.last_name || ''}`}
            className="profile-avatar"
            onError={handleImageError}
          >
            <PersonIcon />
          </Avatar>
        </Box>

        <Divider className="section-divider" />

        {volunteerData.organization && (
          <>
            <Box className="profile-section">
              <Box className="section-header">
                <BusinessIcon className="section-icon" />
                <Typography variant="h6">Організація</Typography>
              </Box>
              <Typography>{volunteerData.organization}</Typography>
            </Box>
            <Divider className="section-divider" />
          </>
        )}

        {parseSkills(volunteerData.skills).length > 0 && (
          <>
            <Box className="profile-section">
              <Box className="section-header">
                <BuildIcon className="section-icon" />
                <Typography variant="h6">Навички</Typography>
              </Box>
              <Box className="skills-list">
                {parseSkills(volunteerData.skills).map((skill, index) => (
                  <Chip 
                    key={index} 
                    label={skill} 
                    className="skill-chip"
                  />
                ))}
              </Box>
            </Box>
            <Divider className="section-divider" />
          </>
        )}

        {volunteerData.description && (
          <>
            <Box className="profile-section">
              <Typography variant="h6" gutterBottom>Опис</Typography>
              <Typography className="profile-description">
                {volunteerData.description}
              </Typography>
            </Box>
            <Divider className="section-divider" />
          </>
        )}

        <Box className="profile-section">
          <Typography variant="h6" gutterBottom>Контакти</Typography>
          <Box className="contact-list">
            <Box className="contact-item">
              <EmailIcon className="contact-icon" />
              <Typography>{volunteerData.email || 'не вказано'}</Typography>
            </Box>
            <Box className="contact-item">
              <PhoneIcon className="contact-icon" />
              <Typography>{formatPhone(volunteerData.phone)}</Typography>
            </Box>
            <Box className="contact-item">
              <TelegramIcon className="contact-icon" />
              <Typography>
                {volunteerData.telegram_id ? `@${volunteerData.telegram_id}` : 'не вказано'}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box className="profile-section system-info">
          <Typography variant="subtitle2">
            <strong>Дата реєстрації:</strong> {formatDate(volunteerData.registration_date)}
          </Typography>
          <Typography variant="subtitle2">
            <strong>Останній вхід:</strong> {formatDate(volunteerData.last_login)}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfilePage;