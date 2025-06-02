import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Box, Divider } from '@mui/material';
import './CarouselCard.css';

const CARD_TYPES = {
  MONITORING: 'Моніторинг',
  DATABASE: 'База',
  CURATORS: 'Куратори'
};

const CARD_COLORS = {
  [CARD_TYPES.MONITORING]: 'card-green',
  [CARD_TYPES.DATABASE]: 'card-blue',
  [CARD_TYPES.CURATORS]: 'card-purple'
};

const CarouselCard = ({ icon, name, description }) => {
  const cardType = useMemo(() => 
    Object.keys(CARD_TYPES).find(key => name.includes(CARD_TYPES[key])),
    [name]
  );

  const colorClass = CARD_COLORS[CARD_TYPES[cardType]] || '';
  const isCurators = cardType === 'CURATORS';

  const renderHeader = () => (
    <Box className="card-header">
      <Box className="icon-container">
        {React.cloneElement(icon, { className: `card-icon ${colorClass}-icon` })}
      </Box>
      <Typography 
        variant="h5" 
        component="div" 
        className="card-title"
      >
        {name}
      </Typography>
    </Box>
  );

  const renderDescription = () => (
    <Typography 
      variant="body1" 
      className={`card-content ${isCurators ? 'curator-content' : ''}`}
    >
      {description.title}
    </Typography>
  );

  const renderItems = () => (
    <ul className="card-list">
      {description.items.map((item, index) => (
        <Typography 
          key={index} 
          component="li" 
          variant="body1" 
          className={`list-item ${isCurators ? 'curator-item' : ''} ${colorClass}-marker`}
        >
          {item}
        </Typography>
      ))}
    </ul>
  );

  return (
    <Card className={`carousel-item-card ${colorClass}`} elevation={3}>
      <CardContent className="card-content-wrapper">
        {renderHeader()}
        <Divider className="card-divider" />
        {renderDescription()}
        {renderItems()}
      </CardContent>
    </Card>
  );
};

CarouselCard.propTypes = {
  icon: PropTypes.element.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.shape({
    title: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired
};

export default memo(CarouselCard); 