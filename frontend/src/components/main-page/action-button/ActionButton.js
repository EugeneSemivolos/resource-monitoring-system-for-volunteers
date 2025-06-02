import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import './ActionButton.css';

const ActionButton = ({ 
  text, 
  onClick, 
  size = 'large', 
  color = 'primary',
  disabled = false,
  fullWidth = false,
  className = '',
  startIcon,
  endIcon
}) => (
  <Button 
    variant="contained" 
    color={color}
    size={size}
    onClick={onClick}
    disabled={disabled}
    fullWidth={fullWidth}
    className={`action-button ${className}`.trim()}
    startIcon={startIcon}
    endIcon={endIcon}
  >
    {text}
  </Button>
);

ActionButton.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'error', 'info', 'warning']),
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  startIcon: PropTypes.node,
  endIcon: PropTypes.node
};

export default memo(ActionButton); 