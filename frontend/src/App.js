import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import MainPage from './components/main-page/MainPage';
import Navigation from './components/navigation/Navigation';
import ResourcesPage from './components/resources-page/ResourcesPage';
import VolunteersPage from './components/volunteers-page/VolunteersPage';
import RegisterPage from './components/auth/RegisterPage';
import ResourceDetailsPage from './components/resources-page/resource-details/ResourceDetailsPage';
import { UserProvider } from './contexts/UserContext';
import HistoryPage from './components/resources-page/HistoryPage';
import MissionPage from './components/mission-page/MissionPage';
import ProfilePage from './components/profile/ProfilePage';
import Footer from './components/common/Footer';
import './App.css';

// Компонент для скролу на початок при зміні маршруту
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Компонент для обробки паралакс-ефекту
const ParallaxEffect = () => {
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
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return null;
};

const AppRoutes = ({ navValue, setNavValue, loginModalOpen, setLoginModalOpen }) => (
  <Routes>
    <Route 
      path="/" 
      element={
        <MainPage 
          setNavValue={setNavValue} 
          setLoginModalOpen={setLoginModalOpen} 
        />
      } 
    />
    <Route path="/resources" element={<ResourcesPage />} />
    <Route path="/volunteers" element={<VolunteersPage />} />
    <Route path="/mission" element={<MissionPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/profile" element={<ProfilePage />} />
    <Route path="/resources/:id" element={<ResourceDetailsPage />} />
    <Route 
      path="/history" 
      element={
        <HistoryPage 
          navValue={navValue} 
          setNavValue={setNavValue} 
          loginModalOpen={loginModalOpen} 
          setLoginModalOpen={setLoginModalOpen} 
        />
      } 
    />
  </Routes>
);

function App() {
  const [navValue, setNavValue] = useState(0);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  return (
    <UserProvider>
      <BrowserRouter>
        <ScrollToTop />
        <ParallaxEffect />
        <div className="app-wrapper parallax-container">
          <div className="parallax-background" />
          <div className="parallax-overlay" />
          <Navigation 
            navValue={navValue} 
            setNavValue={setNavValue}
            loginModalOpen={loginModalOpen}
            setLoginModalOpen={setLoginModalOpen}
          />
          <div className="content-wrapper">
            <AppRoutes 
              navValue={navValue}
              setNavValue={setNavValue}
              loginModalOpen={loginModalOpen}
              setLoginModalOpen={setLoginModalOpen}
            />
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;