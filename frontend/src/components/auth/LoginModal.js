import React, { useState, useCallback } from 'react';
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

const INITIAL_FORM_STATE = {
  email: '',
  password: ''
};

const ERROR_MESSAGES = {
  403: 'Адміністратор ще не підтвердив вас',
  401: 'Введено неправильний логін або пароль',
  404: 'Користувача з такою електронною поштою не знайдено',
  500: 'Помилка сервера. Спробуйте пізніше',
  networkError: 'Не вдалося з\'єднатися з сервером. Перевірте підключення до інтернету',
  default: 'Виникла неочікувана помилка. Спробуйте пізніше'
};

const LoginModal = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { login } = useUser();
  
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  }, []);

  const handleError = useCallback((error) => {
    if (error.response?.status) {
      setError(ERROR_MESSAGES[error.response.status] || 
        `Не вдалося увійти: ${error.response?.data?.detail || error.response?.data?.message || 'Невідома помилка'}`);
    } else if (error.message === 'Network Error') {
      setError(ERROR_MESSAGES.networkError);
    } else if (typeof error === 'string') {
      setError(error);
    } else if (error.message) {
      setError(error.message);
    } else {
      setError(ERROR_MESSAGES.default);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await login(formData);
      onClose();
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const handleCreateAccount = useCallback(() => {
    onClose();
    navigate('/register');
  }, [onClose, navigate]);

  const renderPasswordField = () => (
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
  );

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
          
          {renderPasswordField()}
          
          <Typography 
            variant="body2" 
            color="primary" 
            className="forgot-password-link"
            onClick={() => {}} // TODO: Implement forgot password functionality
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