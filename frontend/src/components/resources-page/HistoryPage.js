import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, TextField, Button } from '@mui/material';
import './HistoryPage.css';

const SUBJECT_OPTIONS = [
  { value: '', label: 'Всі обʼєкти' },
  { value: 'resource', label: 'Ресурс' },
  { value: 'volunteer', label: 'Волонтер' },
];
const ACTION_OPTIONS = [
  { value: '', label: 'Всі дії' },
  { value: 'added', label: 'Додано' },
  { value: 'updated', label: 'Змінено' },
  { value: 'deleted', label: 'Видалено' },
];
const PAGE_SIZE = 10;

const translateSubject = (subject) => {
  switch (subject) {
    case 'resource':
      return 'Ресурс';
    case 'volunteer':
      return 'Волонтер';
    default:
      return subject;
  }
};

const translateAction = (action) => {
  switch (action) {
    case 'added':
      return 'Додано';
    case 'updated':
      return 'Змінено';
    case 'deleted':
      return 'Видалено';
    default:
      return action;
  }
};

const HistoryPage = ({ navValue, setNavValue, loginModalOpen, setLoginModalOpen }) => {
  const [logs, setLogs] = useState([]);
  const [subject, setSubject] = useState('');
  const [action, setAction] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);

  const fetchLogs = async (reset = false, customOffset = 0) => {
    setLoading(true);
    let url = `/api/history/?offset=${customOffset}&page_size=${PAGE_SIZE}`;
    if (subject) url += `&subject=${subject}`;
    if (action) url += `&action=${action}`;
    if (dateFrom) url += `&date_from=${dateFrom}`;
    if (dateTo) url += `&date_to=${dateTo}`;
    try {
      const res = await fetch(url);
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
  };

  useEffect(() => {
    fetchLogs(true, 0);
    // eslint-disable-next-line
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchLogs(true, 0);
  };

  const handleShowMore = () => {
    fetchLogs(false, offset);
  };

  // Конфігурація для випадаючого меню, щоб запобігти зсуву сторінки
  const menuProps = {
    PaperProps: {
      style: {
        maxHeight: 300,
      }
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ background: '#fff', borderRadius: 2, boxShadow: 1, p: 2 }}>Історія змін</Typography>
      <Box
        component="form"
        onSubmit={handleFilter}
        className="history-filters"
      >
        <Select 
          value={subject} 
          onChange={e => setSubject(e.target.value)} 
          displayEmpty 
          className="filter-select"
          MenuProps={menuProps}
        >
          {SUBJECT_OPTIONS.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
        </Select>
        <Select 
          value={action} 
          onChange={e => setAction(e.target.value)} 
          displayEmpty 
          className="filter-select"
          MenuProps={menuProps}
        >
          {ACTION_OPTIONS.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
        </Select>
        <TextField
          type="date"
          label="Від"
          InputLabelProps={{ shrink: true }}
          value={dateFrom}
          onChange={e => setDateFrom(e.target.value)}
          className="filter-date"
        />
        <TextField
          type="date"
          label="До"
          InputLabelProps={{ shrink: true }}
          value={dateTo}
          onChange={e => setDateTo(e.target.value)}
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
            {loading && logs.length === 0 ? (
              <TableRow><TableCell colSpan={6}>Завантаження...</TableCell></TableRow>
            ) : logs.length === 0 ? (
              <TableRow><TableCell colSpan={6}>Записів не знайдено</TableCell></TableRow>
            ) : logs.map((log, idx) => (
              <TableRow key={log.id}>
                <TableCell>{log.id}</TableCell>
                <TableCell>{translateSubject(log.subject)}</TableCell>
                <TableCell>{translateAction(log.action)}</TableCell>
                <TableCell>{log.description}</TableCell>
                <TableCell>{log.performer || 'Система'}</TableCell>
                <TableCell>{new Date(log.timestamp).toLocaleString('uk-UA')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {logs.length < total && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Button 
            onClick={handleShowMore} 
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
