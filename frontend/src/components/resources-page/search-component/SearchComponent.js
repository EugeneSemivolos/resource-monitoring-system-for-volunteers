import React from 'react';
import {
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CategoryIcon from '@mui/icons-material/Category';
import './SearchComponent.css';

const SearchComponent = ({ 
  searchTerm, 
  setSearchTerm, 
  categoryFilter, 
  setCategoryFilter, 
  locationFilter, 
  setLocationFilter,
  categories,
  locations
}) => {
  // Конфигурация для выпадающего меню, чтобы предотвратить сдвиг страницы
  const menuProps = {
    // Фиксирует размер бумажного элемента меню
    PaperProps: {
      style: {
        maxHeight: 300,
      }
    },
    // Важно: предотвращает блокировку скролла, которая вызывает сдвиг
    disableScrollLock: true,
    // Важно: предотвращает сдвиг страницы при открытии
    MenuListProps: {
      style: {
        paddingTop: 0,
        paddingBottom: 0
      }
    },
    // Контейнер меню
    container: document.body
  };

  const handleSearch = () => {
    // Здесь можно добавить дополнительную логику поиска при нажатии на кнопку
    console.log("Поиск по:", searchTerm, categoryFilter, locationFilter);
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
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              },
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
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
              slotProps={{
                root: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <CategoryIcon color="action" />
                    </InputAdornment>
                  )
                }
              }}
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
              slotProps={{
                root: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon color="action" />
                    </InputAdornment>
                  )
                }
              }}
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