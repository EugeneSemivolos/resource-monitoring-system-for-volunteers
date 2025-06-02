import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { volunteerService } from '../services/api';

// Створення контексту
export const UserContext = createContext();

// Кастомний хук для використання контексту користувача
export const useUser = () => useContext(UserContext);

// Компонент UserProvider для обгортання застосунку
export const UserProvider = ({ children }) => {
  const [state, setState] = useState({
    user: null,
    loading: true,
    shouldRefreshVolunteers: false
  });

  const updateState = (updates) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  // Перевірка авторизації при завантаженні
  useEffect(() => {
    const checkLoggedInUser = async () => {
      try {
        const currentUser = volunteerService.getCurrentUser();
        if (currentUser?.id) {
          const userData = await volunteerService.getVolunteerById(currentUser.id);
          updateState({ user: userData });
        }
      } catch (error) {
        console.error('Помилка при отриманні даних користувача:', error);
      } finally {
        updateState({ loading: false });
      }
    };

    checkLoggedInUser();
  }, []);

  // Функції для роботи з користувачем
  const login = useCallback(async (credentials) => {
    try {
      const response = await volunteerService.loginVolunteer(credentials);
      if (response.volunteer) {
        const userData = await volunteerService.getVolunteerById(response.volunteer.id);
        updateState({ user: userData });
      }
      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    volunteerService.logoutVolunteer();
    updateState({ user: null });
  }, []);

  const updateUser = useCallback((userData) => {
    updateState({ user: userData });
    localStorage.setItem('currentUser', JSON.stringify(userData));
    updateState({ shouldRefreshVolunteers: true });
  }, []);

  const setShouldRefreshVolunteers = useCallback((value) => {
    updateState({ shouldRefreshVolunteers: value });
  }, []);

  const contextValue = {
    user: state.user,
    loading: state.loading,
    login,
    logout,
    updateUser,
    shouldRefreshVolunteers: state.shouldRefreshVolunteers,
    setShouldRefreshVolunteers,
    isAuthenticated: !!state.user
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}; 