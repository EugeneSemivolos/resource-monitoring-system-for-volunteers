import React, { useEffect, useState } from 'react';
import { Typography, Container, Box, Alert, Snackbar } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import CategoryIcon from '@mui/icons-material/Category';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useLocation, useNavigate } from 'react-router-dom';
import Mission from './mission/Mission';
import CarouselCard from './carousel-card/CarouselCard';
import WelcomeSection from './welcome-section/WelcomeSection';
import JoinUsSection from './join-us-section/JoinUsSection';
import './MainPage.css';

// Дані для карток у каруселі
const CARDS_DATA = [
  {
    id: 'resources',
    icon: <InventoryIcon className="card-icon resource-icon" />,
    name: "Моніторинг ресурсів",
    description: {
      title: "Наша система дозволяє вам:",
      items: [
        "Переглядати доступні ресурси в реальному часі",
        "Знаходити ресурси за місцем розташування",
        "Зв'язуватися безпосередньо з постачальниками"
      ]
    }
  },
  {
    id: 'volunteers',
    icon: <PeopleIcon className="card-icon volunteer-icon" />,
    name: "База волонтерів",
    description: {
      title: "Створіть свій профіль волонтера та:",
      items: [
        "Опишіть свій досвід та навички",
        "Вкажіть напрямки волонтерської діяльності",
        "Додайте контактну інформацію для зв'язку"
      ]
    }
  },
  {
    id: 'categories',
    icon: <CategoryIcon className="card-icon curator-icon" />,
    name: "Категорії ресурсів",
    description: {
      title: "Зручна система категорій:",
      items: [
        "Медичні засоби та ліки",
        "Продукти харчування",
        "Одяг та спорядження",
        "Технічне обладнання"
      ]
    }
  }
];

// Налаштування каруселі
const CAROUSEL_SETTINGS = {
  showThumbs: false,
  infiniteLoop: true,
  autoPlay: true,
  interval: 6000,
  showStatus: false,
  swipeable: true,
  useKeyboardArrows: true,
  emulateTouch: true,
  stopOnHover: true
};

const MainPage = ({ setNavValue }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const registrationSuccess = location.state?.registrationSuccess;
  const message = location.state?.message;

  useEffect(() => {
    if (registrationSuccess && message) {
      setSnackbarMessage(message);
      setOpenSnackbar(true);
      // Очищаємо стан location після показу повідомлення
      navigate('/', { replace: true });
    }
  }, [registrationSuccess, message, navigate]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const renderMissionSection = () => (
      <Box className="content-box">
        <Typography variant="h4" gutterBottom className="section-title">
          Наша задача
        </Typography>
        
        <p className="section-text">
        Система моніторингу ресурсів для волонтерів допомагає ефективно координувати 
        волонтерську діяльність, забезпечуючи швидке реагування на потреби громади 
        та оптимальне використання наявних ресурсів.
        </p>
        
        <p className="section-text">
        Волонтерство відіграє критичну роль у сучасному суспільстві, особливо в часи кризи. 
        Громадянське суспільство активізується там, де державні механізми не можуть забезпечити 
        всі потреби громадян, особливо найбільш вразливих груп населення.
        </p>
      </Box>
  );

  const renderCarouselSection = () => (
      <div className="carousel-container">
        <Typography variant="h4" component="h2" className="section-title">
          Чим можемо бути корисним?
        </Typography>
        
        <Carousel className="card-carousel" {...CAROUSEL_SETTINGS}>
        {CARDS_DATA.map(({ id, icon, name, description }) => (
            <CarouselCard 
            key={id}
            icon={icon}
            name={name}
            description={description}
            />
          ))}
        </Carousel>
      </div>
  );

  return (
    <Container maxWidth={false} className="main-page-container">
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ 
          top: '80px !important',
          zIndex: 1000
        }}
      >
        <Alert 
          onClose={handleCloseSnackbar}
          severity="success"
          variant="filled"
          sx={{ 
            width: '100%', 
            maxWidth: '600px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <div className="welcome-section">
        <WelcomeSection setNavValue={setNavValue} />
      </div>
      {renderMissionSection()}
      {renderCarouselSection()}
      <div className="mission-section">
        <Mission />
      </div>
      <div className="join-us-section">
        <JoinUsSection />
      </div>
    </Container>
  );
};

export default MainPage;
