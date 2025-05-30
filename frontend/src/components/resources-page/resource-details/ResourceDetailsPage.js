import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../../navigation/Navigation';
import { Container, CircularProgress, Typography, Box, Divider, Chip } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CategoryIcon from '@mui/icons-material/Category';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import notFoundImage from '../../../images/not_found.png';
import './ResourceDetailsPage.css';
import { useUser } from '../../../contexts/UserContext';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import { resourceService } from '../../../services/api';

const API_URL = 'http://localhost:8000/api/resources/';

const ResourceDetailsPage = () => {
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [navValue, setNavValue] = useState(1); // 1 = ресурси
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [newQuantity, setNewQuantity] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();

  useEffect(() => {
    const fetchResource = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}${id}/`);
        if (!response.ok) throw new Error('Resource not found');
        const data = await response.json();
        setResource(data);
      } catch (err) {
        setError('Не вдалося завантажити дані про ресурс');
      } finally {
        setLoading(false);
      }
    };
    fetchResource();
  }, [id]);

  const getImageUrl = (photoPath) => {
    if (!photoPath) return notFoundImage;
    if (typeof photoPath === 'string' && photoPath.startsWith('http')) return photoPath;
    if (typeof photoPath === 'object' && photoPath.url) return photoPath.url;
    return `http://localhost:8000${photoPath}`;
  };

  // Функція для перекладу статусу ресурсу на українську
  const translateStatus = (status) => {
    if (!status) return '';
    const map = {
      'available': 'Доступний',
      'unavailable': 'Недоступний',
      'in_use': 'Використовується',
      'reserved': 'Зарезервовано',
      'pending': 'В очікуванні',
      'delivered': 'Доставлено',
      'expired': 'Прострочено',
      // Додайте інші статуси за потреби
    };
    return map[status] || status;
  };

  return (
    <div className="app-wrapper parallax-container">
      <div className="parallax-background"></div>
      <div className="parallax-overlay"></div>
      <Navigation navValue={navValue} setNavValue={setNavValue} loginModalOpen={loginModalOpen} setLoginModalOpen={setLoginModalOpen} />
      <div className="content-wrapper">
        <Container maxWidth="md" sx={{ mt: 4 }}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" align="center">{error}</Typography>
          ) : resource ? (
            <Box className="resource-details-box" sx={{ background: 'rgba(255,255,255,0.95)', borderRadius: 2, p: 4, boxShadow: 2 }}>
              <Box className="resource-details-header" mb={2}>
                <img
                  src={getImageUrl(resource.photo)}
                  alt={resource.name}
                  className="resource-details-image"
                  onError={e => { e.target.onerror = null; e.target.src = notFoundImage; }}
                />
                <Box className="resource-details-header-info">
                  <Typography className="resource-details-title" gutterBottom>{resource.name}</Typography>
                  <Box className="resource-details-chips">
                    <Chip icon={<CategoryIcon />} label={resource.category} size="small" />
                    <Chip icon={<LocationOnIcon />} label={resource.storage_location} size="small" />
                  </Box>
                  {resource.organization && (
                    <Typography className="resource-details-organization">
                      Організація: {resource.organization}
                    </Typography>
                  )}
                  {resource.status && (
                    <Typography className="resource-details-status-label">Статус: {translateStatus(resource.status)}</Typography>
                  )}
                </Box>
              </Box>
              <Divider className="resource-details-divider" />
              <Typography className="resource-details-section-label">Опис</Typography>
              <Typography className="resource-details-description" gutterBottom>{resource.comment || 'Опис відсутній'}</Typography>
              <Divider className="resource-details-divider" />
              <Typography className="resource-details-section-label">Кількість</Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography className="resource-details-quantity-detail" gutterBottom>{Number(resource.quantity) % 1 === 0 ? Number(resource.quantity) : Number(resource.quantity).toFixed(2)} {resource.unit}</Typography>
                {isAuthenticated && (
                  <Button variant="outlined" size="small" color="primary" onClick={() => {
                    setUpdateModalOpen(true);
                    setNewQuantity(Number(resource.quantity) % 1 === 0 ? Number(resource.quantity) : Number(resource.quantity).toFixed(2));
                    setUpdateError('');
                    setUpdateSuccess('');
                  }}>Оновити</Button>
                )}
              </Box>
              <Divider className="resource-details-divider" />
              <Box className="resource-details-meta">
                {resource.added_by && (
                  <Typography className="resource-details-meta-item">
                    Додав: <b>{resource.added_by}</b>
                  </Typography>
                )}
                {resource.date_added && (
                  <Typography className="resource-details-meta-item">
                    Дата додавання: <b>{new Date(resource.date_added).toLocaleString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</b>
                  </Typography>
                )}
              </Box>
            </Box>
          ) : null}
          <Box className="resource-details-back" onClick={() => navigate('/resources')}>
            <ArrowBackIcon className="resource-details-back-icon" />
            <span className="resource-details-back-text">До списку ресурсів</span>
          </Box>
          {/* Модальне вікно для оновлення кількості */}
          <Dialog open={updateModalOpen} onClose={() => setUpdateModalOpen(false)} maxWidth="xs" fullWidth>
            <DialogTitle>Оновити кількість ресурсу</DialogTitle>
            <DialogContent>
              <TextField
                label="Нова кількість"
                type="number"
                value={newQuantity}
                onChange={e => setNewQuantity(e.target.value)}
                fullWidth
                autoFocus
                margin="normal"
                inputProps={{ min: 0 }}
              />
              {updateError && <Alert severity="error" sx={{ mt: 1 }}>{updateError}</Alert>}
              {updateSuccess && <Alert severity="success" sx={{ mt: 1 }}>{updateSuccess}</Alert>}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setUpdateModalOpen(false)} color="secondary">Скасувати</Button>
              <Button onClick={async () => {
                const val = Number(newQuantity);
                if (isNaN(val) || val < 0) {
                  setUpdateError('Вкажіть коректну кількість');
                  setUpdateSuccess('');
                  return;
                }
                setUpdateError('');
                try {
                  const updated = await resourceService.updateResource(resource.id, { quantity: val });
                  setUpdateSuccess('Кількість успішно оновлено!');
                  setResource(prev => ({ ...prev, quantity: updated.quantity }));
                  setTimeout(() => setUpdateModalOpen(false), 1000);
                } catch (e) {
                  setUpdateError(e.message || 'Помилка при оновленні');
                  setUpdateSuccess('');
                }
              }} color="primary" variant="contained">Оновити</Button>
            </DialogActions>
          </Dialog>
        </Container>
      </div>
    </div>
  );
};

export default ResourceDetailsPage; 