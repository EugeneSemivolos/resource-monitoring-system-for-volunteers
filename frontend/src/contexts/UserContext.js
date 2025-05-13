import React, { createContext, useState, useEffect, useContext } from 'react';
import { volunteerService } from '../services/api';

// Створення контексту
export const UserContext = createContext();

// Кастомний хук для використання контексту користувача
export const useUser = () => useContext(UserContext);

// Компонент UserProvider для обгортання застосунку
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // перевірка при монтуванні компонента, чи користувач вже ввійшов
  useEffect(() => {
    const checkLoggedInUser = () => {
      const currentUser = volunteerService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
      setLoading(false);
    };

    checkLoggedInUser();
  }, []);

  // функція входу
  const login = async (credentials) => {
    try {
      const response = await volunteerService.loginVolunteer(credentials);
      setUser(response.volunteer);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // функція виходу
  const logout = () => {
    volunteerService.logoutVolunteer();
    setUser(null);
  };

  // оновлення даних користувача
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  // значення контексту
  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 