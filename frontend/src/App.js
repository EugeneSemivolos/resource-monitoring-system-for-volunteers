import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import MainPage from './components/main-page/MainPage';
import Mission from './components/main-page/mission/Mission';
import Navigation from './components/navigation/Navigation';
import ResourcesPage from './components/resources-page/ResourcesPage';
import VolunteersPage from './components/volunteers-page/VolunteersPage';
import RegisterPage from './components/auth/RegisterPage';
import { UserProvider } from './contexts/UserContext';
import './App.css';

// створення обгортача для обробки стану розташування
const MainContent = ({ navValue, setNavValue, loginModalOpen, setLoginModalOpen }) => {
  const location = useLocation();
  
  useEffect(() => {
    // перевірка, чи є стан з навігації
    if (location.state && location.state.showLoginModal) {
      setLoginModalOpen(true);
    }
  }, [location, setLoginModalOpen]);

  return (
    <div className="app-wrapper parallax-container">
      {/* фонове зображення з ефектом параллакса */}
      <div className="parallax-background"></div>
      <div className="parallax-overlay"></div>
      
      <Navigation 
        navValue={navValue} 
        setNavValue={setNavValue}
        loginModalOpen={loginModalOpen}
        setLoginModalOpen={setLoginModalOpen}
      />
      
      <div className="content-wrapper">
        {navValue === 0 && <MainPage />}
        {navValue === 1 && <ResourcesPage />}
        {navValue === 2 && <VolunteersPage />}
        {navValue === 3 && <Mission />}
      </div>
    </div>
  );
};

function App() {
  const [navValue, setNavValue] = useState(0);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // ефект параллакса при прокрутці
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

    // ініціалізуємо позицію при завантаженні сторінки
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route 
            path="/register" 
            element={<RegisterPage />} 
          />
          <Route 
            path="/*"
            element={
              <MainContent 
                navValue={navValue} 
                setNavValue={setNavValue}
                loginModalOpen={loginModalOpen}
                setLoginModalOpen={setLoginModalOpen}
              />
            } 
          />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;