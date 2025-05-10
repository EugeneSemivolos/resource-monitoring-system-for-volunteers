import React from 'react';
import { Button } from '@mui/material';
import './ActionButton.css';

const ActionButton = ({ text, onClick, size = 'large', color = 'primary' }) => {
  return (
    <Button 
      variant="contained" 
      color={color}
      size={size}
      onClick={onClick}
      className="action-button"
      sx={{ 
        borderRadius: 2,
        px: 4,
        py: 2,
        fontWeight: 'bold',
        backgroundColor: '#1976d2',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
        '&:hover': {
          backgroundColor: '#1565c0',
        }
      }}
    >
      {text}
    </Button>
  );
};

export default ActionButton; 