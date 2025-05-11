import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  CircularProgress,
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import SearchComponent from './search-component/SearchComponent';
import ResourceCard from './resource-card/ResourceCard';
import './ResourcesPage.css';

// Константы для категорий, соответствующие backend
const CATEGORY_OPTIONS = {
  ALL: 'all',
  MEDICAL: 'медичні засоби',
  EQUIPMENT: 'спорядження',
  FOOD: 'продукти',
  TECH: 'обладнання',
  CLOTHES: 'одяг',
  OTHER: 'інше'
};

const ResourcesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(CATEGORY_OPTIONS.ALL);
  const [locationFilter, setLocationFilter] = useState('all');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Получить данные из API
    setLoading(true);
    fetch('http://localhost:8000/api/resources/')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        
        // Проверяем, является ли ответ объектом с пагинацией или массивом
        const resultsArray = data.results ? data.results : data;
        
        // Проверяем, является ли resultsArray массивом
        if (!Array.isArray(resultsArray)) {
          console.error('API response is not an array or paginated object:', data);
          throw new Error('Unexpected API response format');
        }
        
        // Преобразуем данные из API в формат для отображения
        const apiResources = resultsArray.map(item => ({
          id: item.id,
          name: item.name,
          category: item.category.charAt(0).toUpperCase() + item.category.slice(1),  // Приводим к формату с большой буквы
          location: item.storage_location,
          quantity: parseFloat(item.quantity),
          unit: item.unit,
          description: item.comment || 'Описание отсутствует',
          photo: item.photo || null,
          status: item.status
        }));
        
        // Устанавливаем данные из API
        setResources(apiResources);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching resources:', error);
        setError('Не вдалося завантажити дані про ресурси');
        setLoading(false);
      });
  }, []);

  // Массив категорий для фильтра
  const categories = [
    CATEGORY_OPTIONS.ALL, 
    CATEGORY_OPTIONS.MEDICAL, 
    CATEGORY_OPTIONS.EQUIPMENT, 
    CATEGORY_OPTIONS.FOOD, 
    CATEGORY_OPTIONS.TECH, 
    CATEGORY_OPTIONS.CLOTHES, 
    CATEGORY_OPTIONS.OTHER
  ];
  
  // Получаем уникальные локации из данных ресурсов
  const uniqueLocations = ['all', ...new Set(resources.map(resource => resource.location).filter(Boolean))];

  // Фильтрация ресурсов
  const filteredResources = resources.filter(resource => {
    // Фильтрация по категории (case insensitive)
    const categoryMatch = categoryFilter === 'all' || resource.category.toLowerCase() === categoryFilter.toLowerCase();
    
    // Фильтрация по локации
    const locationMatch = locationFilter === 'all' || resource.location === locationFilter;
    
    // Фильтрация по поисковому запросу
    const searchMatch = searchTerm === '' || 
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (resource.description && resource.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return categoryMatch && locationMatch && searchMatch;
  });

  return (
    <Container maxWidth="lg" className="resources-container">
      <div className="header-container">
        <div className="header-content">
          <CategoryIcon className="header-icon" />
          <Typography variant="h4" className="header-title">
            База даних ресурсів
          </Typography>
          <CategoryIcon className="header-icon" />
        </div>
      </div>

      {/* Компонент поиска */}
      <SearchComponent 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        categories={categories}
        locations={uniqueLocations}
      />

      {/* Индикатор загрузки */}
      {loading ? (
        <div className="resources-loading">
          <CircularProgress />
        </div>
      ) : error ? (
        <div className="resources-error">
          <Typography color="error">{error}</Typography>
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="resources-empty">
          <Typography variant="h6">Ресурси не знайдено</Typography>
        </div>
      ) : (
        /* Список ресурсів */
        <div className="resources-grid">
          {filteredResources.map((resource) => (
            <div className="resources-grid-item" key={resource.id}>
              <ResourceCard resource={resource} />
            </div>
          ))}
        </div>
      )}
    </Container>
  );
};

export default ResourcesPage;
