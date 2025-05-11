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

const VolunteersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Загрузка данных о волонтерах из API
    const fetchVolunteers = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/volunteers/');
        
        if (!response.ok) {
          throw new Error('Помилка отримання даних');
        }
        
        const data = await response.json();

        // Обработка пагинированных данных
        const resultsArray = data.results ? data.results : data;
        
        // Проверка, является ли результат массивом
        if (!Array.isArray(resultsArray)) {
          console.error('API response is not an array or paginated object:', data);
          throw new Error('Unexpected API response format');
        }
        
        setVolunteers(resultsArray);
        setLoading(false);
      } catch (error) {
        console.error('Помилка при завантаженні даних:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, []);

  // Фильтрация волонтеров по поисковому запросу
  const filteredVolunteers = volunteers.filter(volunteer => {
    const fullName = `${volunteer.last_name || ''} ${volunteer.first_name || ''} ${volunteer.middle_name || ''}`.toLowerCase();
    const skills = (volunteer.skills || '').toLowerCase();
    const org = (volunteer.organization || '').toLowerCase();
    const description = (volunteer.description || '').toLowerCase();
    const searchTermLower = searchTerm.toLowerCase();
    
    return fullName.includes(searchTermLower) || 
           skills.includes(searchTermLower) || 
           org.includes(searchTermLower) ||
           description.includes(searchTermLower);
  });

  return (
    <Container maxWidth="lg" className="volunteers-container">
      <div className="volunteers-header-container">
        <div className="volunteers-header-content">
          <PeopleIcon className="volunteers-header-icon" />
          <Typography variant="h4" className="header-title">
            База даних волонтерів
          </Typography>
          <PeopleIcon className="volunteers-header-icon" />
        </div>
      </div>

      {/* Компонент поиска */}
      <VolunteerSearchComponent 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Отображаем загрузку или ошибку */}
      {loading ? (
        <div className="volunteers-loading">
          <CircularProgress />
        </div>
      ) : error ? (
        <div className="volunteers-error">
          <Typography color="error">{error}</Typography>
        </div>
      ) : (
        // Список волонтерів
        <div className="volunteers-grid">
          {filteredVolunteers.length > 0 ? (
            filteredVolunteers.map((volunteer) => (
              <div className="volunteers-grid-item" key={volunteer.id}>
                <VolunteerCard volunteer={volunteer} />
              </div>
            ))
          ) : (
            <div className="volunteers-no-results">
              <Typography variant="body1">Волонтерів не знайдено</Typography>
            </div>
          )}
        </div>
      )}
    </Container>
  );
};

export default VolunteersPage; 