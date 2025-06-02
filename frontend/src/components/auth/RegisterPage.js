import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Avatar,
  Alert
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useNavigate } from 'react-router-dom';
import { volunteerService } from '../../services/api';
import './RegisterPage.css';

const INITIAL_FORM_STATE = {
    lastName: '',
    firstName: '',
    middleName: '',
    phone: '',
    email: '',
    telegramId: '',
    skills: '',
    description: '',
    organization: '',
    password: '',
    confirmPassword: '',
    photoUrl: null
};

const VALIDATION_RULES = {
  password: {
    minLength: 8,
    message: 'Пароль повинен містити щонайменше 8 символів!'
  },
  confirmPassword: {
    match: 'password',
    message: 'Паролі не співпадають!'
  }
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleParallax = useCallback(() => {
    let ticking = false;
    let lastScrollY = 0;
    
    const updateParallax = () => {
      lastScrollY = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const parallaxBg = document.querySelector('.parallax-background');
          if (parallaxBg) {
            parallaxBg.style.transform = `translateY(${lastScrollY * 0.1}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    updateParallax();
    window.addEventListener('scroll', updateParallax, { passive: true });
    return () => window.removeEventListener('scroll', updateParallax);
  }, []);

  useEffect(() => {
    const cleanup = handleParallax();
    return () => cleanup();
  }, [handleParallax]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  }, []);

  const handlePhotoChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setFormData(prev => ({ ...prev, photoUrl: file }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const validateForm = useCallback(() => {
    if (formData.password.length < VALIDATION_RULES.password.minLength) {
      setError(VALIDATION_RULES.password.message);
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(VALIDATION_RULES.confirmPassword.message);
      return false;
    }
    return true;
  }, [formData.password, formData.confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await volunteerService.registerVolunteer(formData);
      navigate('/', { 
        state: { 
          showLoginModal: true,
          refresh: true
        } 
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Помилка при реєстрації. Спробуйте ще раз.');
      setIsSubmitting(false);
    }
  };

  const renderField = useCallback(({ name, label, description, type = 'text', required = false }) => (
    <Box className="field-container">
      <Typography variant="caption" className="field-description">
        {description}
      </Typography>
      <TextField
        label={label}
        name={name}
        type={type}
        value={formData[name]}
        onChange={handleChange}
        fullWidth
        required={required}
        variant="outlined"
        className="form-field"
        disabled={isSubmitting}
      />
    </Box>
  ), [formData, handleChange, isSubmitting]);

  const renderPhotoUpload = () => (
    <Box className="photo-upload-container">
      <input
        type="file"
        accept="image/*"
        id="photo-upload"
        onChange={handlePhotoChange}
        style={{ display: 'none' }}
      />
      <label htmlFor="photo-upload">
        <Button
          variant="outlined"
          component="span"
          startIcon={<CloudUploadIcon />}
          className="upload-button"
          disabled={isSubmitting}
        >
          Завантажити фото
        </Button>
      </label>
      {photoPreview && (
        <Avatar
          src={photoPreview}
          alt="Preview"
          className="photo-preview"
        />
      )}
    </Box>
  );

  return (
    <div className="app-wrapper">
      <Container maxWidth="sm" className="register-page-container">
        <Paper elevation={3} className="register-page-paper">
          <Typography variant="h4" component="h1" align="center" className="register-page-title">
            Реєстрація волонтера
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box className="register-page-content">
              <Box className="form-section">
                <Typography variant="h6" className="section-title">
                  Особиста інформація
                </Typography>
                
                {renderField({
                  name: 'lastName',
                  label: 'Прізвище',
                  description: 'Введіть ваше прізвище',
                  required: true
                })}
                
                {renderField({
                  name: 'firstName',
                  label: "Ім'я",
                  description: "Введіть ваше ім'я",
                  required: true
                })}
                
                {renderField({
                  name: 'middleName',
                  label: 'По батькові',
                  description: "Введіть ваше по батькові (необов'язково)"
                })}
                
                {renderField({
                  name: 'phone',
                  label: 'Номер телефону',
                  description: 'Введіть ваш номер телефону',
                  required: true
                })}
                
                {renderField({
                  name: 'email',
                  label: 'Електронна пошта',
                  description: 'Введіть вашу електронну пошту',
                  type: 'email',
                  required: true
                })}
                
                {renderField({
                  name: 'telegramId',
                  label: 'Telegram ID',
                  description: "Введіть ваш Telegram ID (необов'язково)"
                })}
                
                {renderField({
                  name: 'skills',
                  label: 'Навички',
                  description: 'Опишіть ваші навички та досвід',
                  required: true
                })}
                
                {renderField({
                  name: 'description',
                  label: 'Про себе',
                  description: 'Розкажіть про себе'
                })}
                
                {renderField({
                  name: 'organization',
                  label: 'Організація',
                  description: 'Вкажіть вашу організацію'
                })}
                
                {renderField({
                  name: 'password',
                  label: 'Пароль',
                  description: 'Придумайте надійний пароль',
                  type: 'password',
                  required: true
                })}
                
                {renderField({
                  name: 'confirmPassword',
                  label: 'Підтвердження пароля',
                  description: 'Повторіть пароль',
                  type: 'password',
                  required: true
                })}

                {renderPhotoUpload()}
              </Box>

              {error && (
                <Alert severity="error" className="error-alert">
                  {error}
                </Alert>
              )}

              <Box className="form-actions">
              <Button 
                  type="button"
                  variant="outlined"
                  onClick={() => navigate('/')}
                className="cancel-button"
                  disabled={isSubmitting}
              >
                Скасувати
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Реєстрація...' : 'Зареєструватися'}
              </Button>
              </Box>
            </Box>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default RegisterPage; 