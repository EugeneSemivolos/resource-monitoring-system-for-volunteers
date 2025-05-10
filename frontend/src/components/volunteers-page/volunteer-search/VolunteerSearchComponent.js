import React from 'react';
import {
  TextField,
  InputAdornment,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import './VolunteerSearchComponent.css';

const VolunteerSearchComponent = ({ 
  searchTerm, 
  setSearchTerm, 
}) => {
  const handleSearch = () => {
    // Здесь можно добавить дополнительную логику поиска при нажатии на кнопку
    console.log("Поиск волонтеров по:", searchTerm);
  };

  return (
    <div className="volunteer-search-container">
      <div className="volunteer-search-grid">
        <div className="volunteer-search-field-container">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Пошук волонтерів..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="volunteer-search-field"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
        </div>
        
        <div className="volunteer-button-container">
          <Button 
            variant="contained" 
            color="primary" 
            className="volunteer-search-button"
            onClick={handleSearch}
          >
            Пошук
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VolunteerSearchComponent; 