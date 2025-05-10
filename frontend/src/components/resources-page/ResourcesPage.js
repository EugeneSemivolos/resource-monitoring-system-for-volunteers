import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import SearchComponent from './search-component/SearchComponent';
import ResourceCard from './resource-card/ResourceCard';
import './ResourcesPage.css';

const mockResources = [
  {
    id: 1,
    name: "Медичні маски",
    category: "Медичні засоби",
    location: "Київ",
    quantity: 1000,
    unit: "шт.",
    description: "Одноразові медичні маски, тришарові"
  },
  {
    id: 2,
    name: "Спальні мішки",
    category: "Спорядження",
    location: "Львів",
    quantity: 50,
    unit: "шт.",
    description: "Спальні мішки для використання в холодну пору року"
  },
  {
    id: 3,
    name: "Продуктові набори",
    category: "Продукти",
    location: "Харків",
    quantity: 200,
    unit: "наборів",
    description: "Набори тривалого зберігання: крупи, консерви, чай"
  },
];

const ResourcesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [resources, setResources] = useState([...mockResources]);

  useEffect(() => {
    // Получить данные из API
    fetch('http://localhost:8000/api/resources/')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Преобразуем данные из API в формат для отображения
        const apiResources = data.map(item => ({
          id: item.id,
          name: item.name,
          category: item.category,
          location: item.storage_location,
          quantity: parseFloat(item.quantity),
          unit: item.unit,
          description: item.comment || 'Описание отсутствует',
        }));
        
        // Обновляем список ресурсов, добавляя данные из API к существующим макетам
        setResources([...mockResources, ...apiResources]);
      })
      .catch(error => {
        console.error('Error fetching resources:', error);
      });
  }, []);

  const categories = ['all', 'Медичні засоби', 'Спорядження', 'Продукти', 'Обладнання', 'Одяг'];
  const locations = ['all', 'Київ', 'Львів', 'Харків', 'Одеса', 'Дніпро'];

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
        locations={locations}
      />

      {/* Список ресурсів */}
      <div className="resources-grid">
        {resources.map((resource) => (
          <div className="resources-grid-item" key={resource.id}>
            <ResourceCard resource={resource} />
          </div>
        ))}
      </div>
    </Container>
  );
};

export default ResourcesPage;
