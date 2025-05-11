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

const mockVolunteers = [
  {
    id: 1,
    first_name: "Іван",
    last_name: "Петренко",
    middle_name: "Олександрович",
    organization: "Червоний хрест",
    skills: "Медична допомога, водіння",
    description: "Волонтер з досвідом у сфері медичної допомоги",
    photo: null
  },
  {
    id: 2,
    first_name: "Марія",
    last_name: "Ковальчук",
    middle_name: "Іванівна",
    organization: "Армія SOS",
    skills: "Логістика, координація",
    description: "Координатор волонтерських груп",
    photo: null
  },
  {
    id: 3,
    first_name: "Олег",
    last_name: "Сидоренко",
    middle_name: "Петрович",
    organization: "Волонтери без кордонів",
    skills: "IT, комунікації",
    description: "Розробка веб-сайтів для волонтерських організацій",
    photo: null
  },
];

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
        
        // Если данные получены успешно, используем их, иначе используем тестовые данные
        if (data && data.length > 0) {
          setVolunteers(data);
        } else {
          setVolunteers(mockVolunteers);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Помилка при завантаженні даних:', error);
        setError(error.message);
        setVolunteers(mockVolunteers); // Используем тестовые данные в случае ошибки
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, []);

  // Фильтрация волонтеров по поисковому запросу
  const filteredVolunteers = volunteers.filter(volunteer => {
    const fullName = `${volunteer.last_name} ${volunteer.first_name} ${volunteer.middle_name || ''}`.toLowerCase();
    const skills = (volunteer.skills || '').toLowerCase();
    const org = (volunteer.organization || '').toLowerCase();
    const searchTermLower = searchTerm.toLowerCase();
    
    return fullName.includes(searchTermLower) || 
           skills.includes(searchTermLower) || 
           org.includes(searchTermLower);
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
          <Typography variant="body2">Відображаються тестові дані</Typography>
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