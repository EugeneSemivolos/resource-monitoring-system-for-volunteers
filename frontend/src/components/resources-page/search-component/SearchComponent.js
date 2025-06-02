import React from 'react';
import {
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CategoryIcon from '@mui/icons-material/Category';
import { resourceService } from '../../../services/api';
import './SearchComponent.css';

const SearchComponent = ({ 
  searchTerm, 
  setSearchTerm, 
  categoryFilter, 
  setCategoryFilter, 
  locationFilter, 
  setLocationFilter,
  categories,
  locations,
  onSearch
}) => {
  // Конфігурація для випадаючого меню, щоб запобігти зсуву сторінки
  const menuProps = {
    // Фіксує розмір паперового елемента меню
    PaperProps: {
      style: {
        maxHeight: 300,
      }
    },
    // Важливо: запобігає блокуванню прокрутки, яка викликає зсув
    disableScrollLock: true,
    // Важливо: запобігає зсуву сторінки при відкритті
    MenuListProps: {
      style: {
        paddingTop: 0,
        paddingBottom: 0
      }
    },
    // Контейнер меню
    container: document.body
  };

  const handleSearch = async () => {
    try {
      const results = await resourceService.searchResources({
        searchTerm,
        category: categoryFilter,
        location: locationFilter
      });
      if (onSearch) {
        onSearch(results);
      }
    } catch (error) {
      console.error('Помилка при пошуку ресурсів:', error);
      // Тут можна додати відображення помилки користувачу
    }
  };

  return (
    <div className="search-container">
      <div className="search-grid">
        <div className="search-field-container">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Пошук ресурсів..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-field"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              )
            }}
          />
        </div>
        
        <div className="category-field-container">
          <FormControl fullWidth className="category-field">
            <InputLabel>Категорія</InputLabel>
            <Select
              value={categoryFilter}
              label="Категорія"
              onChange={(e) => setCategoryFilter(e.target.value)}
              MenuProps={menuProps}
              startAdornment={
                <InputAdornment position="start">
                  <CategoryIcon color="action" />
                </InputAdornment>
              }
            >
              {categories.map(category => (
                <MenuItem key={category} value={category}>
                  {category === 'all' ? 'Всі категорії' : category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        
        <div className="location-field-container">
          <FormControl fullWidth className="location-field">
            <InputLabel>Локація</InputLabel>
            <Select
              value={locationFilter}
              label="Локація"
              onChange={(e) => setLocationFilter(e.target.value)}
              MenuProps={menuProps}
              startAdornment={
                <InputAdornment position="start">
                  <LocationOnIcon color="action" />
                </InputAdornment>
              }
            >
              {locations.map(location => (
                <MenuItem key={location} value={location}>
                  {location === 'all' ? 'Всі локації' : location}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        
        <div className="button-container">
          <Button 
            variant="contained" 
            color="primary" 
            className="search-button"
            onClick={handleSearch}
          >
            Пошук
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchComponent; 