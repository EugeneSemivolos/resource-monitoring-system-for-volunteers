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
    const checkLoggedInUser = async () => {
      try {
        const currentUser = volunteerService.getCurrentUser();
        if (currentUser && currentUser.id) {
          // Отримуємо актуальні дані з сервера
          const userData = await volunteerService.getVolunteerById(currentUser.id);
          setUser(userData);
        }
      } catch (error) {
        console.error('Помилка при отриманні даних користувача:', error);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedInUser();
  }, []);

  // функція входу
  const login = async (credentials) => {
    try {
      const response = await volunteerService.loginVolunteer(credentials);
      if (response.volunteer) {
        // Отримуємо повні дані волонтера після успішного входу
        const userData = await volunteerService.getVolunteerById(response.volunteer.id);
        setUser(userData);
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  // функція виходу
  const logout = () => {
    // Очищаємо дані користувача в сервісі
    volunteerService.logoutVolunteer();
    // Очищаємо стан користувача в контексті
    setUser(null);
  };

  // оновлення даних користувача
  const updateUser = (userData) => {
    setUser(userData);
    // Оновлюємо дані в локальному сховищі
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