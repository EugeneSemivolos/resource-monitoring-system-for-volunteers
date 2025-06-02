import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Avatar,
  IconButton,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { volunteerService } from '../../services/api';
import './EditProfileForm.css';

const EditProfileForm = ({ open, onClose, volunteerData, onUpdate }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    middle_name: '',
    phone: '',
    telegram_id: '',
    organization: '',
    description: '',
    skills: '',
    photo: null
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Оновлюємо дані форми при відкритті модального вікна
  useEffect(() => {
    if (open && volunteerData) {
      setFormData({
        first_name: volunteerData.first_name || '',
        last_name: volunteerData.last_name || '',
        middle_name: volunteerData.middle_name || '',
        phone: volunteerData.phone || '',
        telegram_id: volunteerData.telegram_id || '',
        organization: volunteerData.organization || '',
        description: volunteerData.description || '',
        skills: volunteerData.skills || '',
        photo: null
      });

      setPreviewUrl(
        volunteerData.photo?.startsWith('http')
          ? volunteerData.photo
          : volunteerData.photo
            ? `http://localhost:8000${volunteerData.photo}`
            : null
      );
    }
  }, [open, volunteerData]);

  // Очищаємо форму при закритті
  const handleClose = () => {
    setFormData({
      first_name: '',
      last_name: '',
      middle_name: '',
      phone: '',
      telegram_id: '',
      organization: '',
      description: '',
      skills: '',
      photo: null
    });
    setError(null);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        photo: file
      }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      
      // Додаємо тільки змінені поля
      Object.keys(formData).forEach(key => {
        if (key !== 'photo' && formData[key] !== null && formData[key] !== volunteerData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Додаємо фото, якщо воно було змінено
      if (formData.photo) {
        formDataToSend.append('photo', formData.photo);
      }

      // Перевіряємо, чи є що оновлювати
      if ([...formDataToSend.entries()].length === 0) {
        handleClose();
        return;
      }

      const response = await volunteerService.updateVolunteer(volunteerData.id, formDataToSend);
      onUpdate(response);
      handleClose();
    } catch (err) {
      console.error('Помилка при оновленні профілю:', err);
      setError(err.message || 'Помилка при оновленні профілю');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={loading ? undefined : handleClose}
      maxWidth="sm" 
      fullWidth
      disableEscapeKeyDown={loading}
    >
      <DialogTitle>Редагування профілю</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} className="edit-profile-form">
          <Box className="photo-upload-section">
            <Avatar
              src={previewUrl}
              sx={{ width: 100, height: 100, mb: 2 }}
            />
            <input
              accept="image/*"
              type="file"
              id="photo-upload"
              onChange={handlePhotoChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="photo-upload">
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
              >
                <PhotoCamera />
              </IconButton>
            </label>
            <Typography variant="caption" display="block">
              Натисніть на іконку камери, щоб змінити фото
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Прізвище"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            margin="normal"
          />
          
          <TextField
            fullWidth
            label="Ім'я"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            margin="normal"
          />
          
          <TextField
            fullWidth
            label="По батькові"
            name="middle_name"
            value={formData.middle_name}
            onChange={handleChange}
            margin="normal"
          />
          
          <TextField
            fullWidth
            label="Телефон"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            margin="normal"
          />
          
          <TextField
            fullWidth
            label="Telegram ID"
            name="telegram_id"
            value={formData.telegram_id}
            onChange={handleChange}
            margin="normal"
          />
          
          <TextField
            fullWidth
            label="Організація"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            margin="normal"
          />
          
          <TextField
            fullWidth
            label="Навички"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            margin="normal"
            helperText="Введіть навички через кому"
          />
          
          <TextField
            fullWidth
            label="Опис"
            name="description"
            value={formData.description}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={4}
          />
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Скасувати
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Зберегти'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfileForm; 