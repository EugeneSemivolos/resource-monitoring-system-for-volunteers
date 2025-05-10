import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import VolunteerSearchComponent from './volunteer-search/VolunteerSearchComponent';
import VolunteerCard from './volunteer-card/VolunteerCard';
import './VolunteersPage.css';

const mockVolunteers = [
  {
    id: 1,
    name: "Іван Петренко",
  },
  {
    id: 2,
    name: "Марія Ковальчук",
  },
  {
    id: 3,
    name: "Олег Сидоренко",
  },
];

const VolunteersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [volunteers, setVolunteers] = useState([...mockVolunteers]);

  useEffect(() => {
    // В будущем здесь будет запрос к API для получения данных о волонтерах
    // Пока используем моковые данные
  }, []);

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

      {/* Компонент поиска - только поле ввода и кнопка */}
      <VolunteerSearchComponent 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Список волонтерів */}
      <div className="volunteers-grid">
        {volunteers.map((volunteer) => (
          <div className="volunteers-grid-item" key={volunteer.id}>
            <VolunteerCard volunteer={volunteer} />
          </div>
        ))}
      </div>
    </Container>
  );
};

export default VolunteersPage; 