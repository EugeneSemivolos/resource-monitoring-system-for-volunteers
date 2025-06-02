import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import MainPage from './components/main-page/MainPage';
import Mission from './components/main-page/mission/Mission';
import Navigation from './components/navigation/Navigation';
import ResourcesPage from './components/resources-page/ResourcesPage';
import VolunteersPage from './components/volunteers-page/VolunteersPage';
import RegisterPage from './components/auth/RegisterPage';
import ResourceDetailsPage from './components/resources-page/resource-details/ResourceDetailsPage';
import { UserProvider } from './contexts/UserContext';
import HistoryPage from './components/resources-page/HistoryPage';
import './App.css';

// Компонент для скролу на початок при зміні маршруту
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

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
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <UserProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="app-wrapper parallax-container">
          <div className="parallax-background"></div>
          <div className="parallax-overlay"></div>
          <Navigation 
            navValue={navValue} 
            setNavValue={setNavValue}
            loginModalOpen={loginModalOpen}
            setLoginModalOpen={setLoginModalOpen}
          />
          <div className="content-wrapper">
            <Routes>
              <Route path="/" element={<MainPage setNavValue={setNavValue} />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/volunteers" element={<VolunteersPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/resources/:id" element={<ResourceDetailsPage />} />
              <Route path="/history" element={<HistoryPage navValue={navValue} setNavValue={setNavValue} loginModalOpen={loginModalOpen} setLoginModalOpen={setLoginModalOpen} />} />
              <Route path="/mission" element={<Mission />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;