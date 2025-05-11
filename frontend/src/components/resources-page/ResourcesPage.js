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

// Константи
const API_URL = 'http://localhost:8000/api/resources/';
const DEFAULT_LOCATION = 'all';

// Варіанти категорій відповідно до значень на бекенді
const CATEGORY_OPTIONS = {
  ALL: 'all',
  MEDICAL: 'медичні засоби',
  EQUIPMENT: 'спорядження',
  FOOD: 'продукти',
  TECH: 'обладнання',
  CLOTHES: 'одяг',
  OTHER: 'інше'
};

// Масив категорій для фільтра
const CATEGORIES_ARRAY = [
  CATEGORY_OPTIONS.ALL, 
  CATEGORY_OPTIONS.MEDICAL, 
  CATEGORY_OPTIONS.EQUIPMENT, 
  CATEGORY_OPTIONS.FOOD, 
  CATEGORY_OPTIONS.TECH, 
  CATEGORY_OPTIONS.CLOTHES, 
  CATEGORY_OPTIONS.OTHER
];

const ResourcesPage = () => {
  // Стан
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(CATEGORY_OPTIONS.ALL);
  const [locationFilter, setLocationFilter] = useState(DEFAULT_LOCATION);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Отримання ресурсів з API
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        const resultsArray = processApiResponse(data);
        const formattedResources = formatResourceData(resultsArray);
        
        setResources(formattedResources);
      } catch (error) {
        console.error('Error fetching resources:', error);
        setError('Не вдалося завантажити дані про ресурси');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResources();
  }, []);
  
  // Допоміжна функція для обробки відповіді API (обробка пагінації)
  const processApiResponse = (data) => {
    const resultsArray = data.results ? data.results : data;
    
    if (!Array.isArray(resultsArray)) {
      console.error('API response is not an array or paginated object:', data);
      throw new Error('Unexpected API response format');
    }
    
    return resultsArray;
  };
  
  // Допоміжна функція для форматування даних ресурсів для відображення
  const formatResourceData = (items) => {
    return items.map(item => ({
      id: item.id,
      name: item.name,
      category: item.category.charAt(0).toUpperCase() + item.category.slice(1),  // Перша літера великою
      location: item.storage_location,
      quantity: parseFloat(item.quantity),
      unit: item.unit,
      description: item.comment || 'Опис відсутній',
      photo: item.photo || null,
      status: item.status
    }));
  };

  // Отримання унікальних місць розташування з даних ресурсів
  const uniqueLocations = [DEFAULT_LOCATION, ...new Set(resources.map(resource => resource.location).filter(Boolean))];

  // Фільтрація ресурсів на основі вибору користувача
  const filteredResources = resources.filter(resource => {
    // Фільтр за категорією (без урахування регістру)
    const categoryMatch = categoryFilter === CATEGORY_OPTIONS.ALL || 
                           resource.category.toLowerCase() === categoryFilter.toLowerCase();
    
    // Фільтр за місцем розташування
    const locationMatch = locationFilter === DEFAULT_LOCATION || resource.location === locationFilter;
    
    // Фільтр за пошуковим запитом
    const searchMatch = !searchTerm || 
                         resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (resource.description && resource.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return categoryMatch && locationMatch && searchMatch;
  });

  // Функції відображення
  const renderHeader = () => (
    <div className="header-container">
      <div className="header-content">
        <CategoryIcon className="header-icon" />
        <Typography variant="h4" className="header-title">
          База даних ресурсів
        </Typography>
        <CategoryIcon className="header-icon" />
      </div>
    </div>
  );

  const renderLoading = () => (
    <div className="resources-loading">
      <CircularProgress />
    </div>
  );

  const renderError = () => (
    <div className="resources-error">
      <Typography color="error">{error}</Typography>
    </div>
  );

  const renderEmptyResults = () => (
    <div className="resources-empty">
      <Typography variant="h6">Ресурси не знайдено</Typography>
    </div>
  );

  const renderResourcesList = () => (
    <div className="resources-grid">
      {filteredResources.map((resource) => (
        <div className="resources-grid-item" key={resource.id}>
          <ResourceCard resource={resource} />
        </div>
      ))}
    </div>
  );

  // Основний рендер
  return (
    <Container maxWidth="lg" className="resources-container">
      {renderHeader()}

      <SearchComponent 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        categories={CATEGORIES_ARRAY}
        locations={uniqueLocations}
      />

      {loading ? renderLoading() :
       error ? renderError() :
       filteredResources.length === 0 ? renderEmptyResults() :
       renderResourcesList()}
    </Container>
  );
};

export default ResourcesPage;
