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

const ResourceCard = ({ resource }) => {
  // Получаем URL фотографии ресурса или используем заглушку
  const imageUrl = resource.photo || notFoundImage;

  return (
    <Card className="resource-card">
      <CardContent>
        <div className="resource-card-header">
          <Typography variant="h6" component="h2" gutterBottom className="resource-title">
            {resource.name}
          </Typography>
          <div className="resource-image-container">
            <img 
              src={imageUrl} 
              alt={resource.name} 
              className="resource-image"
            />
          </div>
        </div>
        
        <Divider className="resource-divider" />
        
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

        <Typography 
          variant="body2" 
          color="text.secondary" 
          gutterBottom
          className="resource-description"
        >
          {resource.description}
        </Typography>

        <Typography 
          variant="subtitle1" 
          className="resource-quantity"
        >
          Кількість: {resource.quantity} {resource.unit}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ResourceCard;
