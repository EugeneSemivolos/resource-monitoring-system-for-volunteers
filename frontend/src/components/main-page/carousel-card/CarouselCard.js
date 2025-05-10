import React from 'react';
import { Card, CardContent, Typography, Box, Divider } from '@mui/material';
import './CarouselCard.css';

const CarouselCard = ({ icon, name, description }) => {
  // Визначаємо клас кольору в залежності від назви карточки
  const getCardColorClass = () => {
    if (name.includes('Моніторинг')) return 'card-green';
    if (name.includes('База')) return 'card-blue';
    if (name.includes('Куратори')) return 'card-purple';
    return '';
  };

  const colorClass = getCardColorClass();
  
  const isCurators = name.includes('Куратори');

  return (
    <Card className={`carousel-item-card ${colorClass}`} elevation={3}>
      <CardContent sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        overflowY: 'auto'
      }}>
        <Box className="card-header">
          <Box className="icon-container">
            {React.cloneElement(icon, { className: `card-icon ${colorClass}-icon` })}
          </Box>
          <Typography 
            variant="h5" 
            component="h2" 
            sx={{ 
              fontWeight: 600, 
              fontSize: '1.8rem',
              ml: 2
            }}
          >
            {name}
          </Typography>
        </Box>
        
        <Divider sx={{ my: 2, borderColor: 'rgba(0, 0, 0, 0.08)' }} />
        
        <Typography 
          variant="body1" 
          className="card-content"
          sx={{ 
            fontSize: isCurators ? '1.2rem' : '1.3rem',
            fontWeight: 500,
            mb: 1.5
          }}
        >
          {description.title}
        </Typography>
        
        <ul className="card-list">
          {description.items.map((item, index) => (
            <Typography 
              key={index} 
              component="li" 
              variant="body1" 
              className={`list-item`}
              sx={{ 
                fontSize: isCurators ? '1rem' : '1.15rem',
                mb: isCurators ? 1 : 1.5,
                lineHeight: isCurators ? 1.4 : 1.5,
                color: '#333',
                '&::marker': {
                  color: colorClass === 'card-green' ? '#2e7d32' : 
                          colorClass === 'card-blue' ? '#1976d2' : 
                          colorClass === 'card-purple' ? '#9c27b0' : '#1976d2'
                }
              }}
            >
              {item}
            </Typography>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default CarouselCard; 