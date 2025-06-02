import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Typography,
  CircularProgress,
  Button,
} from '@mui/material';
import {
  People as PeopleIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import VolunteerSearchComponent from './volunteer-search/VolunteerSearchComponent';
import VolunteerCard from './volunteer-card/VolunteerCard';
import { volunteerService } from '../../services/api';
import { useLocation } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import './VolunteersPage.css';

const VolunteersPage = () => {
  const [searchState, setSearchState] = useState({
    term: '',
    volunteers: [],
    loading: true,
    error: null
  });

  const location = useLocation();
  const { shouldRefreshVolunteers, setShouldRefreshVolunteers } = useUser();

  const processApiResponse = useCallback((data) => {
    const resultsArray = data.results ? data.results : data;
    
    if (!Array.isArray(resultsArray)) {
      console.error('API response is not an array or paginated object:', data);
      throw new Error('Unexpected API response format');
    }
    
    return resultsArray;
  }, []);

  const fetchVolunteers = useCallback(async () => {
    try {
      setSearchState(prev => ({ ...prev, loading: true, error: null }));
      const data = await volunteerService.getVolunteers();
      const resultsArray = processApiResponse(data);
      setSearchState(prev => ({ 
        ...prev, 
        volunteers: resultsArray,
        loading: false 
      }));
    } catch (error) {
      console.error('Помилка при завантаженні даних:', error);
      setSearchState(prev => ({ 
        ...prev, 
        error: error.message,
        loading: false 
      }));
    }
  }, [processApiResponse]);

  useEffect(() => {
    fetchVolunteers();
  }, [fetchVolunteers]);

  useEffect(() => {
    if (location.state?.refresh || shouldRefreshVolunteers) {
      fetchVolunteers();
      window.history.replaceState({}, document.title);
      setShouldRefreshVolunteers(false);
    }
  }, [location.state, shouldRefreshVolunteers, setShouldRefreshVolunteers, fetchVolunteers]);

  const getFilteredVolunteers = useCallback(() => {
    return searchState.volunteers.filter(volunteer => {
      if (!searchState.term) return true;

      const searchTermLower = searchState.term.toLowerCase();
      const searchableFields = [
        `${volunteer.last_name || ''} ${volunteer.first_name || ''} ${volunteer.middle_name || ''}`,
        volunteer.skills || '',
        volunteer.organization || '',
        volunteer.description || ''
      ];

      return searchableFields.some(field => 
        field.toLowerCase().includes(searchTermLower)
      );
    });
  }, [searchState.volunteers, searchState.term]);

  const handleSearchTermChange = useCallback((term) => {
    setSearchState(prev => ({ ...prev, term }));
  }, []);

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
      <Typography color="error">
        {searchState.error}
        <Button
          startIcon={<RefreshIcon />}
          onClick={fetchVolunteers}
          color="primary"
          style={{ marginLeft: '1rem' }}
        >
          Оновити
        </Button>
      </Typography>
    </div>
  );

  const renderNoResults = () => (
    <div className="volunteers-no-results">
      <Typography variant="body1">Волонтерів не знайдено</Typography>
      <Button
        startIcon={<RefreshIcon />}
        onClick={fetchVolunteers}
        color="primary"
        style={{ marginTop: '1rem' }}
      >
        Оновити список
      </Button>
    </div>
  );

  const renderVolunteersList = () => {
    const filteredVolunteers = getFilteredVolunteers();
    
    if (filteredVolunteers.length === 0) {
      return renderNoResults();
    }

    return (
      <div className="volunteers-grid">
        {filteredVolunteers.map((volunteer) => (
          <div className="volunteers-grid-item" key={volunteer.id}>
            <VolunteerCard volunteer={volunteer} />
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    if (searchState.loading) {
      return renderLoading();
    }

    if (searchState.error) {
      return renderError();
    }

    return renderVolunteersList();
  };

  return (
    <Container maxWidth="lg" className="volunteers-container">
      {renderHeader()}

      <div className="volunteers-controls">
        <VolunteerSearchComponent 
          searchTerm={searchState.term}
          setSearchTerm={handleSearchTermChange}
        />
      </div>

      {renderContent()}
    </Container>
  );
};

export default VolunteersPage; 