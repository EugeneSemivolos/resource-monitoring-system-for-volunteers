import React from 'react';
import { Typography, Container, Box } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Mission from './mission/Mission';
import CarouselCard from './carousel-card/CarouselCard';
import ActionButton from './action-button/ActionButton';
import WelcomeContainer from './welcome-container/WelcomeContainer';
import './MainPage.css';

const cardsData = [
  {
    icon: <InventoryIcon className="card-icon" style={{ color: '#2e7d32' }} />,
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
    icon: <PeopleIcon className="card-icon" style={{ color: '#1976d2' }} />,
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
    icon: <SupervisorAccountIcon className="card-icon" style={{ color: '#9c27b0' }} />,
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

const MainPage = () => (
  <Container maxWidth="lg">
    <WelcomeContainer />

    <Box sx={{ mt: 4, mb: 5, p: 4, bgcolor: 'rgba(255, 255, 255, 0.95)', borderRadius: 3, boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(25, 118, 210, 0.2)' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2', textAlign: 'center', mb: 3 }}>
        Наша задача
      </Typography>
      <Typography variant="body1" sx={{ 
        mb: 2, 
        fontSize: '1.05rem', 
        textAlign: 'justify',
        fontFamily: 'Nunito, "Open Sans", sans-serif',
        color: '#333',
      }}>
        Система моніторингу ресурсів для волонтерів допомагає ефективно координувати волонтерську діяльність, забезпечуючи швидке реагування на потреби громади та оптимальне використання наявних ресурсів.
      </Typography>
      <Typography variant="body1" sx={{ 
        mb: 3, 
        fontSize: '1.05rem', 
        textAlign: 'justify',
        fontFamily: 'Nunito, "Open Sans", sans-serif',
        color: '#333',
      }}>
        Волонтерство відіграє критичну роль у сучасному суспільстві, особливо в часи кризи. Громадянське суспільство активізується там, де державні механізми не можуть забезпечити всі потреби громадян, особливо найбільш вразливих груп населення.
      </Typography>
    </Box>

    <div className="carousel-container">
      <Typography 
        variant="h4" 
        component="h2" 
        sx={{ 
          fontWeight: 'bold', 
          color: '#1976d2', 
          textAlign: 'center',
          mb: 3,
          position: 'relative',
          pb: 2
        }}
      >
        Чим можемо бути корисним?
      </Typography>
      
      <Carousel 
        showThumbs={false}
        infiniteLoop={true}
        autoPlay={true}
        interval={6000}
        showStatus={false}
        className="card-carousel"
        swipeable={true}
        useKeyboardArrows={true}
        emulateTouch={true}
        stopOnHover={true}
      >
        {cardsData.map((card, index) => (
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
    
    <Box sx={{ mt: 8, mb: 5, p: 4, bgcolor: 'rgba(255, 255, 255, 0.95)', borderRadius: 3, boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(25, 118, 210, 0.2)' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2, color: '#1976d2' }}>
        Приєднуйтесь до нас
      </Typography>
      <Typography variant="body1" sx={{ 
        fontSize: '1.05rem', 
        textAlign: 'center', 
        mb: 3,
        fontFamily: 'Nunito, "Open Sans", sans-serif',
        color: '#333',
        maxWidth: '800px',
        mx: 'auto',
        lineHeight: 1.6,
      }}>
        Якщо ви бажаєте стати частиною нашої команди волонтерів або маєте ресурси, якими готові поділитися, зареєструйтесь на нашій платформі. Разом ми зможемо зробити більше для тих, хто потребує допомоги.
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <ActionButton 
          text="Зареєструватися" 
          onClick={() => console.log('Відкрити форму реєстрації')} 
        />
      </Box>
    </Box>
  </Container>
);

export default MainPage;
