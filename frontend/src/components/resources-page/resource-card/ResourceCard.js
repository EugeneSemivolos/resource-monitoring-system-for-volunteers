import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CategoryIcon from '@mui/icons-material/Category';
import notFoundImage from '../../../images/not_found.png';
import './ResourceCard.css';

// Константи
const API_BASE_URL = 'http://localhost:8000';

const ResourceCard = ({ resource }) => {
  // Обробка URL зображення
  const imageUrl = getImageUrl(resource.photo);

  // Функції відображення
  const renderHeader = () => (
    <div className="resource-card-header">
      <Typography variant="h6" component="h2" gutterBottom className="resource-title">
        {resource.name}
      </Typography>
      <div className="resource-image-container">
        <img 
          src={imageUrl} 
          alt={resource.name} 
          className="resource-image"
          onError={handleImageError}
        />
      </div>
    </div>
  );

  const renderChips = () => (
    <Box className="resource-chips-container">
      <Chip 
        icon={<CategoryIcon />} 
        label={resource.category}
        size="small"
        className="resource-chip"
      />
      <Chip 
        icon={<LocationOnIcon />} 
        label={resource.location}
        size="small"
        className="resource-chip-location"
      />
    </Box>
  );

  const renderDescription = () => (
    <Typography 
      variant="body2" 
      color="text.secondary" 
      gutterBottom
      className="resource-description"
    >
      {resource.description}
    </Typography>
  );

  const renderQuantity = () => (
    <Typography 
      variant="subtitle1" 
      className="resource-quantity"
    >
      Кількість: {resource.quantity} {resource.unit}
    </Typography>
  );

  // Допоміжні функції
  function getImageUrl(photoPath) {
    if (!photoPath || typeof photoPath !== 'string' || photoPath.length === 0) {
      return notFoundImage;
    }
    return `${API_BASE_URL}${photoPath}`;
  }

  function handleImageError(e) {
    e.target.onerror = null;
    e.target.src = notFoundImage;
  }

  // Основний рендер
  return (
    <Card className="resource-card">
      <CardContent>
        {renderHeader()}
        <Divider className="resource-divider" />
        {renderChips()}
        {renderDescription()}
        {renderQuantity()}
      </CardContent>
    </Card>
  );
};

export default ResourceCard;
