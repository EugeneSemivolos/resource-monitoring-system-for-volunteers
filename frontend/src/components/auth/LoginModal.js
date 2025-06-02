import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button, 
  Typography, 
  IconButton,
  InputAdornment,
  Alert,
  Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useUser } from '../../contexts/UserContext';
import './LoginModal.css';

const LoginModal = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await login(formData);
      onClose();
    } catch (error) {
      
      // Перевіряємо наявність response та його структуру
      if (error.response?.status) {
        switch (error.response.status) {
          case 403:
            setError('Адміністратор ще не підтвердив вас');
            break;
          case 401:
            setError('Введено неправильний логін або пароль');
            break;
          case 404:
            setError('Користувача з такою електронною поштою не знайдено');
            break;
          case 500:
            setError('Помилка сервера. Спробуйте пізніше');
            break;
          default:
            setError(`Не вдалося увійти: ${error.response?.data?.detail || error.response?.data?.message || 'Невідома помилка'}`);
        }
      } else if (error.message === 'Network Error') {
        setError('Не вдалося з\'єднатися з сервером. Перевірте підключення до інтернету');
      } else if (typeof error === 'string') {
        setError(error);
      } else if (error.message) {
        setError(error.message);
      } else {
        setError('Виникла неочікувана помилка. Спробуйте пізніше');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
    // TODO: Implement forgot password functionality
  };

  const handleCreateAccount = () => {
    onClose();
    navigate('/register');
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      className="login-dialog"
    >
      <Box className="custom-dialog-title">
        <Typography variant="h5" component="div">
          Вхід до системи
        </Typography>
        <IconButton 
          aria-label="close" 
          onClick={onClose}
          className="close-button"
        >
          <CloseIcon />
        </IconButton>
      </Box>
      
      <form onSubmit={handleSubmit}>
        <DialogContent className="login-content">
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            margin="dense"
            label="Електронна пошта"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
            className="login-input"
            disabled={isLoading}
            error={!!error}
          />
          
          <TextField
            margin="dense"
            label="Пароль"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
            className="login-input"
            disabled={isLoading}
            error={!!error}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                    disabled={isLoading}
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <Typography 
            variant="body2" 
            color="primary" 
            className="forgot-password-link"
            onClick={handleForgotPassword}
          >
            Забули пароль?
          </Typography>
        </DialogContent>
        
        <DialogActions className="login-actions">
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Перевірка...' : 'Увійти'}
          </Button>
          
          <Typography variant="body2" className="create-account-text">
            Новий волонтер? 
            <span 
              className="create-account-link" 
              onClick={handleCreateAccount}
            >
              Створити акаунт
            </span>
          </Typography>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LoginModal; 