import React from 'react';
import { Typography, Container, Box } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Mission from './mission/Mission';
import CarouselCard from './carousel-card/CarouselCard';
import WelcomeSection from './welcome-section/WelcomeSection';
import JoinUsSection from './join-us-section/JoinUsSection';
import './MainPage.css';

// Дані для карток у каруселі
const CARDS_DATA = [
  {
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
    icon: <SupervisorAccountIcon className="card-icon curator-icon" />,
    name: "Куратори проекту",
    description: {
      title: "Наші куратори забезпечують:",
      items: [
        "Відстеження активності волонтерів",
        "Зв'язок для координації спільних дій",
        "Підтримку з питань волонтерства",
        "Допомогу у вирішенні організаційних питань"
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

const MainPage = () => {
  return (
    <Container maxWidth="lg">
      <WelcomeSection />

      {/* Розділ про нашу задачу */}
      <Box className="content-box">
        <Typography variant="h4" gutterBottom className="section-title">
          Наша задача
        </Typography>
        
        <Typography variant="body1" className="section-text">
          Система моніторингу ресурсів для волонтерів допомагає ефективно координувати волонтерську діяльність, забезпечуючи швидке реагування на потреби громади та оптимальне використання наявних ресурсів.
        </Typography>
        
        <Typography variant="body1" className="section-text">
          Волонтерство відіграє критичну роль у сучасному суспільстві, особливо в часи кризи. Громадянське суспільство активізується там, де державні механізми не можуть забезпечити всі потреби громадян, особливо найбільш вразливих груп населення.
        </Typography>
      </Box>

      {/* Розділ з каруселлю */}
      <div className="carousel-container">
        <Typography variant="h4" component="h2" className="section-title">
          Чим можемо бути корисним?
        </Typography>
        
        <Carousel className="card-carousel" {...CAROUSEL_SETTINGS}>
          {CARDS_DATA.map((card, index) => (
            <CarouselCard 
              key={index}
              icon={card.icon}
              name={card.name}
              description={card.description}
            />
          ))}
        </Carousel>
      </div>

      <Mission />
      
      <JoinUsSection />
    </Container>
  );
};

export default MainPage;
