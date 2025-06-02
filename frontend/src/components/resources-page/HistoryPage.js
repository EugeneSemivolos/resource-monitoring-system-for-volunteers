import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, TextField, Button } from '@mui/material';
import './HistoryPage.css';

const PAGE_SIZE = 10;

const SUBJECT_OPTIONS = [
  { value: '', label: 'Всі обʼєкти' },
  { value: 'resource', label: 'Ресурс' },
  { value: 'volunteer', label: 'Волонтер' }
];

const ACTION_OPTIONS = [
  { value: '', label: 'Всі дії' },
  { value: 'added', label: 'Додано' },
  { value: 'updated', label: 'Змінено' },
  { value: 'deleted', label: 'Видалено' }
];

const TRANSLATIONS = {
  subjects: {
    resource: 'Ресурс',
    volunteer: 'Волонтер'
  },
  actions: {
    added: 'Додано',
    updated: 'Змінено',
    deleted: 'Видалено'
  }
};

const MENU_PROPS = {
  PaperProps: {
    style: { maxHeight: 300 }
  },
  disableScrollLock: true,
  MenuListProps: {
    style: {
      paddingTop: 0,
      paddingBottom: 0
    }
  },
  container: document.body
};

const HistoryPage = () => {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({
    subject: '',
    action: '',
    dateFrom: '',
    dateTo: ''
  });
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);

  const buildUrl = useCallback((customOffset = 0) => {
    const params = new URLSearchParams({
      offset: customOffset,
      page_size: PAGE_SIZE
    });

    if (filters.subject) params.append('subject', filters.subject);
    if (filters.action) params.append('action', filters.action);
    if (filters.dateFrom) params.append('date_from', filters.dateFrom);
    if (filters.dateTo) params.append('date_to', filters.dateTo);

    return `/api/history/?${params.toString()}`;
  }, [filters]);

  const fetchLogs = useCallback(async (reset = false, customOffset = 0) => {
    setLoading(true);
    try {
      const res = await fetch(buildUrl(customOffset));
    const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Помилка при завантаженні даних');
      }
      
    setTotal(data.total);
    if (reset) {
      setLogs(data.results);
      setOffset(PAGE_SIZE);
    } else {
      setLogs(prev => [...prev, ...data.results]);
      setOffset(prev => prev + PAGE_SIZE);
    }
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
    setLoading(false);
    }
  }, [buildUrl]);

  useEffect(() => {
    fetchLogs(true, 0);
  }, [fetchLogs]);

  const handleFilterChange = useCallback((field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleFilter = useCallback((e) => {
    e.preventDefault();
    fetchLogs(true, 0);
  }, [fetchLogs]);

  const renderFilters = () => (
    <Box
      component="form"
      onSubmit={handleFilter}
      className="history-filters"
    >
      <Select 
        value={filters.subject} 
        onChange={e => handleFilterChange('subject', e.target.value)} 
        displayEmpty 
        className="filter-select"
        MenuProps={MENU_PROPS}
      >
        {SUBJECT_OPTIONS.map(opt => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>

      <Select 
        value={filters.action} 
        onChange={e => handleFilterChange('action', e.target.value)} 
        displayEmpty 
        className="filter-select"
        MenuProps={MENU_PROPS}
      >
        {ACTION_OPTIONS.map(opt => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>

      <TextField
        type="date"
        label="Від"
        InputLabelProps={{ shrink: true }}
        value={filters.dateFrom}
        onChange={e => handleFilterChange('dateFrom', e.target.value)}
        className="filter-date"
      />

      <TextField
        type="date"
        label="До"
        InputLabelProps={{ shrink: true }}
        value={filters.dateTo}
        onChange={e => handleFilterChange('dateTo', e.target.value)}
        className="filter-date"
      />

      <Button 
        type="submit" 
        variant="contained" 
        color="primary" 
        className="filter-button"
      >
        Фільтрувати
      </Button>
    </Box>
  );

  const renderTableContent = () => {
    if (loading && logs.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6}>Завантаження...</TableCell>
        </TableRow>
      );
    }

    if (logs.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6}>Записів не знайдено</TableCell>
        </TableRow>
      );
    }

    return logs.map(log => (
      <TableRow key={log.id}>
        <TableCell>{log.id}</TableCell>
        <TableCell>{TRANSLATIONS.subjects[log.subject] || log.subject}</TableCell>
        <TableCell>{TRANSLATIONS.actions[log.action] || log.action}</TableCell>
        <TableCell>{log.description}</TableCell>
        <TableCell>{log.performer || 'Система'}</TableCell>
        <TableCell>{new Date(log.timestamp).toLocaleString('uk-UA')}</TableCell>
      </TableRow>
    ));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{
          background: '#fff',
          borderRadius: 2,
          boxShadow: 1,
          p: 2 
        }}
      >
        Історія змін
      </Typography>

      {renderFilters()}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>№</TableCell>
              <TableCell>Обʼєкт</TableCell>
              <TableCell>Дія</TableCell>
              <TableCell>Опис</TableCell>
              <TableCell>Виконавець</TableCell>
              <TableCell>Дата та час</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {renderTableContent()}
          </TableBody>
        </Table>
      </TableContainer>

      {logs.length < total && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Button 
            onClick={() => fetchLogs(false, offset)} 
            disabled={loading} 
            variant="contained" 
            color="primary" 
            className="load-more-button"
          >
            Показати ще
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default HistoryPage;
