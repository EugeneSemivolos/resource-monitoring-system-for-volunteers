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
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Telegram as TelegramIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Build as BuildIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  AccessTime as AccessTimeIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useUser } from '../../contexts/UserContext';
import { volunteerService } from '../../services/api';
import EditProfileForm from './EditProfileForm';
import { useNavigate } from 'react-router-dom';
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

const formatPhone = (phone) => {
  if (!phone) return 'не вказано';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+38 (${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6,8)}-${cleaned.slice(8)}`;
  }
  return phone;
};

const parseSkills = (skills) => {
  if (!skills) return [];
  if (typeof skills === 'string') {
    return skills.split(',').map(skill => skill.trim()).filter(skill => skill);
  }
  return Array.isArray(skills) ? skills : [];
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useUser();
  const [volunteerData, setVolunteerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchVolunteerData = useCallback(async () => {
    if (!user?.id) {
      setError('Не вдалося визначити ID користувача');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await volunteerService.getVolunteerById(user.id);
      setVolunteerData(response);
    } catch (err) {
      console.error('Помилка при завантаженні даних профілю:', err);
      if (err.response?.status === 404) {
        setError('Профіль не знайдено. Можливо, ви були видалені з системи.');
      } else if (err.response?.status === 401) {
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

  const handleProfileUpdate = useCallback((updatedData) => {
    setVolunteerData(updatedData);
    updateUser(updatedData);
  }, [updateUser]);

  const getPhotoUrl = useCallback((photo) => {
    if (!photo) return null;
    return photo.startsWith('http') ? photo : `http://localhost:8000${photo}`;
  }, []);

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      await volunteerService.deleteVolunteer(user.id);
      logout();
      navigate('/');
    } catch (error) {
      setError(error.message);
      setIsDeleting(false);
    }
  };

  const renderContactInfo = () => (
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
  );

  const renderOrganizationInfo = () => (
    volunteerData.organization && (
      <Box className="profile-section">
        <Typography variant="h6" gutterBottom>
          Організація
        </Typography>
        <Box className="organization-info">
          <BusinessIcon />
          <Typography>{volunteerData.organization}</Typography>
        </Box>
      </Box>
    )
  );

  const renderSkills = () => (
    volunteerData.skills && (
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
    )
  );

  const renderDescription = () => (
    volunteerData.description && (
      <Box className="profile-section">
        <Typography variant="h6" gutterBottom>
          Про мене
        </Typography>
        <Typography className="profile-description">
          {volunteerData.description}
        </Typography>
      </Box>
    )
  );

  const renderSystemInfo = () => (
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
        <Box className="info-item delete-account">
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setIsDeleteDialogOpen(true)}
            fullWidth
          >
            Видалити акаунт
          </Button>
        </Box>
      </Box>
    </Box>
  );

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
              onClick={fetchVolunteerData}
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
            onClick={() => setIsEditModalOpen(true)}
          >
            Редагувати профіль
          </Button>
        </Box>

        <Divider className="section-divider" />

        <Box className="profile-main-info">
          <Box className="profile-avatar-container">
            <Avatar
              src={getPhotoUrl(volunteerData.photo)}
              onError={(e) => { e.target.src = null }}
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
          {renderContactInfo()}
          {renderOrganizationInfo()}
          {renderSkills()}
          {renderDescription()}
          {renderSystemInfo()}
        </Box>
      </Paper>

      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => !isDeleting && setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>Підтвердження видалення акаунту</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Ви впевнені, що хочете видалити свій акаунт? Ця дія є незворотною і призведе до втрати всіх ваших даних.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setIsDeleteDialogOpen(false)} 
            disabled={isDeleting}
          >
            Скасувати
          </Button>
          <Button
            onClick={handleDeleteAccount}
            color="error"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={20} /> : <DeleteIcon />}
          >
            {isDeleting ? 'Видалення...' : 'Видалити'}
          </Button>
        </DialogActions>
      </Dialog>

      <EditProfileForm
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        volunteerData={volunteerData}
        onUpdate={handleProfileUpdate}
      />
    </Container>
  );
};

export default ProfilePage;