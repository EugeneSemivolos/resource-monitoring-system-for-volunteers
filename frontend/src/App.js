import React, { useEffect } from 'react';
import { Typography } from '@mui/material';
import MainPage from './components/main-page/MainPage';
import Mission from './components/main-page/mission/Mission';
import Navigation from './components/navigation/Navigation';
import ResourcesPage from './components/resources-page/ResourcesPage';
import './App.css';

function App() {
  const [navValue, setNavValue] = React.useState(0);

  // Ефект параллакса при прокрутці
  useEffect(() => {
    let ticking = false;
    let lastScrollY = 0;
    
    const handleScroll = () => {
      lastScrollY = window.scrollY;
      
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const parallaxBg = document.querySelector('.parallax-background');
          if (parallaxBg) {
            parallaxBg.style.transform = `translateY(${lastScrollY * 0.1}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    // Ініціалізуємо позицію при завантаженні сторінки
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="app-wrapper parallax-container">
      {/* Фонове зображення з ефектом параллакса */}
      <div className="parallax-background"></div>
      <div className="parallax-overlay"></div>
      
      <Navigation navValue={navValue} setNavValue={setNavValue} />
      
      <div className="content-wrapper">
        {navValue === 0 && <MainPage />}
        {navValue === 1 && <ResourcesPage />}
        {navValue === 2 && <Typography>Волонтери</Typography>}
        {navValue === 3 && <Mission />}
      </div>
    </div>
  );
}

export default App;