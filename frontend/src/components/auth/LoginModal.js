import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button, 
  Typography, 
  IconButton,
  InputAdornment
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import './LoginModal.css';

const LoginModal = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login form submitted:', formData);
    // TODO: Add authentication logic
    onClose();
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
      <DialogTitle className="login-title">
        <Typography variant="h5">Вхід до системи</Typography>
        <IconButton 
          aria-label="close" 
          onClick={onClose}
          className="close-button"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent className="login-content">
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
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
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
          >
            Увійти
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