import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  CircularProgress,
  Button,
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import SearchComponent from './search-component/SearchComponent';
import ResourceCard from './resource-card/ResourceCard';
import './ResourcesPage.css';
import AddResourceModal from './AddResourceModal';
import { useUser } from '../../contexts/UserContext';
import { useLocation } from 'react-router-dom';
import { resourceService } from '../../services/api';

// Константи
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
const CATEGORIES_ARRAY = Object.values(CATEGORY_OPTIONS);

const ResourcesPage = () => {
  const [searchState, setSearchState] = useState({
    term: '',
    category: CATEGORY_OPTIONS.ALL,
    location: DEFAULT_LOCATION
  });
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useUser();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const location = useLocation();

  const formatResourceData = useCallback((item) => ({
    id: item.id,
    name: item.name,
    category: item.category.charAt(0).toUpperCase() + item.category.slice(1),
    location: item.storage_location,
    quantity: parseFloat(item.quantity),
    unit: item.unit,
    description: item.comment || 'Опис відсутній',
    photo: item.photo || null,
    status: item.status
  }), []);

  const processApiResponse = useCallback((data) => {
    const resultsArray = data.results ? data.results : data;
    
    if (!Array.isArray(resultsArray)) {
      console.error('API response is not an array or paginated object:', data);
      throw new Error('Unexpected API response format');
    }
    
    return resultsArray.map(formatResourceData);
  }, [formatResourceData]);

  const fetchResources = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await resourceService.getResources();
      if (data) {
        setResources(processApiResponse(data));
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
      setError('Не вдалося завантажити дані про ресурси. Спробуйте оновити сторінку.');
    } finally {
      setLoading(false);
    }
  }, [processApiResponse]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources, location.key]);

  useEffect(() => {
    if (location.state?.updatedResourceId) {
      fetchResources();
      window.history.replaceState({}, document.title);
    }
  }, [location.state, fetchResources]);
  
  useEffect(() => {
    if (location.state?.deletedResourceId) {
      setResources(prev => prev.filter(r => r.id !== location.state.deletedResourceId));
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleSearchResults = useCallback((searchResults) => {
    if (searchResults) {
      setResources(processApiResponse(searchResults));
    }
  }, [processApiResponse]);

  const handleNewResource = useCallback((newResource) => {
    setResources(prev => [formatResourceData(newResource), ...prev]);
  }, [formatResourceData]);

  const getFilteredResources = useCallback(() => {
    return resources.filter(resource => {
      const categoryMatch = searchState.category === CATEGORY_OPTIONS.ALL || 
                          resource.category.toLowerCase() === searchState.category.toLowerCase();
    
      const locationMatch = searchState.location === DEFAULT_LOCATION || 
                          resource.location === searchState.location;
    
      const searchMatch = !searchState.term || 
                        resource.name.toLowerCase().includes(searchState.term.toLowerCase()) ||
                        (resource.description && resource.description.toLowerCase().includes(searchState.term.toLowerCase()));
    
    return categoryMatch && locationMatch && searchMatch;
  });
  }, [resources, searchState]);

  const uniqueLocations = [
    DEFAULT_LOCATION, 
    ...new Set(resources.map(resource => resource.location).filter(Boolean))
  ];

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

  const renderAddResourceSection = () => (
    isAuthenticated && (
        <div className="add-resource-container">
          <div className="add-resource-content">
            <span className="add-resource-title">ДОДАТИ РЕСУРС</span>
            <Button
              variant="contained"
              color="primary"
              className="add-resource-button"
              onClick={() => setAddModalOpen(true)}
              aria-label="Додати ресурс"
            >
              +
            </Button>
            <Button
              variant="contained"
              color="primary"
              className="history-button"
              onClick={() => window.location.href = '/history'}
              aria-label="Історія змін"
            >
              Історія змін
            </Button>
          </div>
        </div>
    )
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="resources-loading">
          <CircularProgress />
        </div>
      );
    }

    if (error) {
      return (
        <div className="resources-error">
          <Typography color="error">{error}</Typography>
        </div>
      );
    }

    const filteredResources = getFilteredResources();
    
    if (filteredResources.length === 0) {
      return (
        <div className="resources-empty">
          <Typography variant="h6">Ресурси не знайдено</Typography>
        </div>
      );
    }

    return (
      <div className="resources-grid">
        {filteredResources.map((resource) => (
          <div className="resources-grid-item" key={resource.id}>
            <ResourceCard resource={resource} />
          </div>
        ))}
      </div>
    );
  };

  // Основний рендер
  return (
    <Container maxWidth="lg" className="resources-container">
      {renderHeader()}
      
      <SearchComponent 
        searchTerm={searchState.term}
        setSearchTerm={(term) => setSearchState(prev => ({ ...prev, term }))}
        categoryFilter={searchState.category}
        setCategoryFilter={(category) => setSearchState(prev => ({ ...prev, category }))}
        locationFilter={searchState.location}
        setLocationFilter={(location) => setSearchState(prev => ({ ...prev, location }))}
        categories={CATEGORIES_ARRAY}
        locations={uniqueLocations}
        onSearch={handleSearchResults}
      />

      {renderAddResourceSection()}

      <AddResourceModal 
        open={addModalOpen} 
        onClose={() => setAddModalOpen(false)} 
        onResourceAdded={handleNewResource}
      />

      {renderContent()}
    </Container>
  );
};

export default ResourcesPage;
