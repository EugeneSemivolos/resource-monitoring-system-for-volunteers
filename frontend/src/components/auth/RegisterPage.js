import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Avatar
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
  });
  
  const [photoPreview, setPhotoPreview] = useState(null);

  // Ефект параллакса при прокрутці
  useEffect(() => {
    let ticking = false;
    let lastScrollY = 0;
    
    const handleScroll = () => {
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

    // Ініціалізуємо позицію при завантаженні сторінки
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setFormData(prevData => ({
          ...prevData,
          photoUrl: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registration form submitted:', formData);
    // TODO: Add API call to register the volunteer
    navigate('/');
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="app-wrapper parallax-container">
      {/* Фонове зображення з ефектом параллакса */}
      <div className="parallax-background"></div>
      <div className="parallax-overlay"></div>
      
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
                
                <Box className="field-container">
                  <Typography variant="caption" className="field-description">
                    Введіть ваше прізвище
                  </Typography>
                  <TextField
                    label="Прізвище"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    fullWidth
                    required
                    variant="outlined"
                    className="form-field"
                  />
                </Box>
                
                <Box className="field-container">
                  <Typography variant="caption" className="field-description">
                    Введіть ваше ім'я
                  </Typography>
                  <TextField
                    label="Ім'я"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    fullWidth
                    required
                    variant="outlined"
                    className="form-field"
                  />
                </Box>
                
                <Box className="field-container">
                  <Typography variant="caption" className="field-description">
                    Введіть ваше по батькові (необов'язково)
                  </Typography>
                  <TextField
                    label="По батькові"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    className="form-field"
                  />
                </Box>
                
                <Box className="field-container">
                  <Typography variant="caption" className="field-description">
                    Введіть ваш номер телефону
                  </Typography>
                  <TextField
                    label="Номер телефону"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    fullWidth
                    required
                    variant="outlined"
                    className="form-field"
                  />
                </Box>
                
                <Box className="field-container">
                  <Typography variant="caption" className="field-description">
                    Введіть вашу електронну пошту
                  </Typography>
                  <TextField
                    label="Електронна пошта"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    required
                    variant="outlined"
                    className="form-field"
                  />
                </Box>
                
                <Box className="field-container">
                  <Typography variant="caption" className="field-description">
                    Введіть ваш Telegram ID (необов'язково)
                  </Typography>
                  <TextField
                    label="Telegram ID"
                    name="telegramId"
                    value={formData.telegramId}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    className="form-field"
                  />
                </Box>
                
                <Box className="field-container">
                  <Typography variant="caption" className="field-description">
                    Введіть назву вашої організації
                  </Typography>
                  <TextField
                    label="Організація"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    fullWidth
                    required
                    variant="outlined"
                    className="form-field"
                  />
                </Box>
              </Box>
              
              <Box className="form-section">
                <Typography variant="subtitle1" className="section-subtitle">
                  Фото профілю (необов'язкове)
                </Typography>
                <Box className="photo-upload-container">
                  {photoPreview ? (
                    <Avatar 
                      src={photoPreview} 
                      alt="Фото профілю" 
                      className="profile-photo-preview"
                    />
                  ) : (
                    <Avatar className="profile-photo-placeholder">
                      <CloudUploadIcon />
                    </Avatar>
                  )}
                  <input
                    accept="image/*"
                    className="photo-input"
                    id="photo-upload"
                    type="file"
                    onChange={handlePhotoChange}
                  />
                  <label htmlFor="photo-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      className="upload-button"
                      startIcon={<CloudUploadIcon />}
                    >
                      Завантажити фото
                    </Button>
                  </label>
                </Box>
              </Box>
              
              <Box className="form-section">
                <Typography variant="h6" className="section-title">
                  Навички та опис
                </Typography>
                
                <Box className="field-container">
                  <Typography variant="caption" className="field-description">
                    Перелічіть ваші навички через кому (логістика, медична допомога, тощо)
                  </Typography>
                  <TextField
                    label="Навички"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    fullWidth
                    required
                    variant="outlined"
                    className="form-field"
                  />
                </Box>
                
                <Box className="field-container">
                  <Typography variant="caption" className="field-description">
                    Опишіть ваш досвід, мотивацію та можливості як волонтера
                  </Typography>
                  <TextField
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    fullWidth
                    required
                    variant="outlined"
                    multiline
                    rows={4}
                    placeholder="Опишіть ваш досвід, мотивацію та можливості як волонтера..."
                    className="form-field"
                  />
                </Box>
              </Box>
              
              <Box className="form-section">
                <Typography variant="h6" className="section-title">
                  Дані для входу
                </Typography>
                
                <Box className="field-container">
                  <Typography variant="caption" className="field-description">
                    Створіть надійний пароль
                  </Typography>
                  <TextField
                    label="Пароль"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    fullWidth
                    required
                    variant="outlined"
                    className="form-field"
                  />
                </Box>
                
                <Box className="field-container">
                  <Typography variant="caption" className="field-description">
                    Підтвердіть ваш пароль
                  </Typography>
                  <TextField
                    label="Підтвердження пароля"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    fullWidth
                    required
                    variant="outlined"
                    className="form-field"
                  />
                </Box>
              </Box>
            </Box>

            <Box className="register-page-actions">
              <Button 
                onClick={handleCancel} 
                className="cancel-button"
              >
                Скасувати
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="submit-button"
              >
                Зареєструватися
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default RegisterPage; 