import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
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

const INITIAL_FORM_STATE = {
  first_name: '',
  last_name: '',
  middle_name: '',
  phone: '',
  telegram_id: '',
  organization: '',
  description: '',
  skills: '',
  photo: null
};

const FORM_FIELDS = [
  { name: 'last_name', label: 'Прізвище' },
  { name: 'first_name', label: 'Ім\'я' },
  { name: 'middle_name', label: 'По батькові' },
  { name: 'phone', label: 'Телефон' },
  { name: 'telegram_id', label: 'Telegram ID' },
  { name: 'organization', label: 'Організація' },
  { name: 'skills', label: 'Навички', helperText: 'Введіть навички через кому' },
  { name: 'description', label: 'Опис', multiline: true, rows: 4 }
];

const EditProfileForm = ({ open, onClose, volunteerData, onUpdate }) => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && volunteerData) {
      setFormData({
        ...INITIAL_FORM_STATE,
        ...Object.fromEntries(
          Object.entries(volunteerData)
            .filter(([key]) => key in INITIAL_FORM_STATE)
        )
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

  const handleClose = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setError(null);
    onClose();
  }, [onClose]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handlePhotoChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Будь ласка, виберіть файл зображення');
        return;
      }
      setFormData(prev => ({
        ...prev,
        photo: file
      }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && key !== 'photo') {
          if (value !== volunteerData[key]) {
            formDataToSend.append(key, value);
          }
        }
      });

      if (formData.photo instanceof File) {
        formDataToSend.append('photo', formData.photo);
      }

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

  const renderPhotoUpload = () => (
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
  );

  const renderFormFields = () => (
    FORM_FIELDS.map(field => (
      <TextField
        key={field.name}
        fullWidth
        margin="normal"
        {...field}
        value={formData[field.name]}
        onChange={handleChange}
      />
    ))
  );

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
          {renderPhotoUpload()}
          {renderFormFields()}
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

EditProfileForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  volunteerData: PropTypes.object,
  onUpdate: PropTypes.func.isRequired
};

export default EditProfileForm; 