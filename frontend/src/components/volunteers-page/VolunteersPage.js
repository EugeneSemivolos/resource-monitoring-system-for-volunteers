import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  CircularProgress,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import VolunteerSearchComponent from './volunteer-search/VolunteerSearchComponent';
import VolunteerCard from './volunteer-card/VolunteerCard';
import './VolunteersPage.css';

// Константи
const API_URL = 'http://localhost:8000/api/volunteers/';

const VolunteersPage = () => {
  // Стан
  const [searchTerm, setSearchTerm] = useState('');
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Отримання даних про волонтерів з API
  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
        
        if (!response.ok) {
          throw new Error('Помилка отримання даних');
        }
        
        const data = await response.json();
        const resultsArray = processApiResponse(data);
        
        setVolunteers(resultsArray);
      } catch (error) {
        console.error('Помилка при завантаженні даних:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, []);
  
  // Допоміжна функція для обробки відповіді API (обробка пагінації)
  const processApiResponse = (data) => {
    // Обробка пагінації
    const resultsArray = data.results ? data.results : data;
    
    // Перевірка формату відповіді
    if (!Array.isArray(resultsArray)) {
      console.error('API response is not an array or paginated object:', data);
      throw new Error('Unexpected API response format');
    }
    
    return resultsArray;
  };

  // Фільтрація волонтерів на основі пошукового запиту
  const filteredVolunteers = volunteers.filter(volunteer => {
    const fullName = `${volunteer.last_name || ''} ${volunteer.first_name || ''} ${volunteer.middle_name || ''}`.toLowerCase();
    const skills = (volunteer.skills || '').toLowerCase();
    const org = (volunteer.organization || '').toLowerCase();
    const description = (volunteer.description || '').toLowerCase();
    const searchTermLower = searchTerm.toLowerCase();
    
    return !searchTerm || 
           fullName.includes(searchTermLower) || 
           skills.includes(searchTermLower) || 
           org.includes(searchTermLower) ||
           description.includes(searchTermLower);
  });
  
  // Функції відображення
  const renderHeader = () => (
    <div className="volunteers-header-container">
      <div className="volunteers-header-content">
        <PeopleIcon className="volunteers-header-icon" />
        <Typography variant="h4" className="header-title">
          База даних волонтерів
        </Typography>
        <PeopleIcon className="volunteers-header-icon" />
      </div>
    </div>
  );
  
  const renderLoading = () => (
    <div className="volunteers-loading">
      <CircularProgress />
    </div>
  );
  
  const renderError = () => (
    <div className="volunteers-error">
      <Typography color="error">{error}</Typography>
    </div>
  );
  
  const renderNoResults = () => (
    <div className="volunteers-no-results">
      <Typography variant="body1">Волонтерів не знайдено</Typography>
    </div>
  );
  
  const renderVolunteersList = () => (
    <div className="volunteers-grid">
      {filteredVolunteers.map((volunteer) => (
        <div className="volunteers-grid-item" key={volunteer.id}>
          <VolunteerCard volunteer={volunteer} />
        </div>
      ))}
    </div>
  );

  // Основний рендер
  return (
    <Container maxWidth="lg" className="volunteers-container">
      {renderHeader()}

      <VolunteerSearchComponent 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {loading ? renderLoading() :
       error ? renderError() :
       filteredVolunteers.length === 0 ? renderNoResults() :
       renderVolunteersList()}
    </Container>
  );
};

export default VolunteersPage; 