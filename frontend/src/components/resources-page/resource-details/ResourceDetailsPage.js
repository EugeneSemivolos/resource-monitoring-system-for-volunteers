import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  CircularProgress, 
  Typography, 
  Box, 
  Divider, 
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert
} from '@mui/material';
import {
  LocationOn as LocationOnIcon,
  Category as CategoryIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import notFoundImage from '../../../images/not_found.png';
import './ResourceDetailsPage.css';
import { useUser } from '../../../contexts/UserContext';
import { resourceService } from '../../../services/api';

const STATUS_TRANSLATIONS = {
  available: 'Доступний',
  unavailable: 'Недоступний',
  in_use: 'Використовується',
  reserved: 'Зарезервовано',
  pending: 'В очікуванні',
  delivered: 'Доставлено',
  expired: 'Прострочено'
};

const ResourceDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();

  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateState, setUpdateState] = useState({
    modalOpen: false,
    quantity: '',
    error: '',
    success: ''
  });

  const fetchResource = useCallback(async () => {
      try {
        setLoading(true);
      const data = await resourceService.getResourceById(id);
        setResource(data);
      } catch (err) {
        setError('Не вдалося завантажити дані про ресурс');
      } finally {
        setLoading(false);
      }
  }, [id]);

  useEffect(() => {
    fetchResource();
  }, [fetchResource]);

  const getImageUrl = useCallback((photoPath) => {
    if (!photoPath) return notFoundImage;
    if (typeof photoPath === 'string' && photoPath.startsWith('http')) return photoPath;
    if (typeof photoPath === 'object' && photoPath.url) return photoPath.url;
    return `http://localhost:8000${photoPath}`;
  }, []);

  const handleUpdateModalOpen = useCallback(() => {
    setUpdateState(prev => ({
      ...prev,
      modalOpen: true,
      quantity: Number(resource.quantity) % 1 === 0 
        ? Number(resource.quantity) 
        : Number(resource.quantity).toFixed(2),
      error: '',
      success: ''
    }));
  }, [resource]);

  const handleUpdateModalClose = useCallback(() => {
    setUpdateState(prev => ({ ...prev, modalOpen: false }));
  }, []);

  const handleQuantityChange = useCallback((e) => {
    setUpdateState(prev => ({ ...prev, quantity: e.target.value }));
  }, []);

  const handleQuantityUpdate = useCallback(async () => {
    const val = Number(updateState.quantity);
    
    if (isNaN(val) || val < 0) {
      setUpdateState(prev => ({
        ...prev,
        error: 'Вкажіть коректну кількість',
        success: ''
      }));
      return;
    }

    try {
      if (val === 0) {
        await resourceService.deleteResource(resource.id);
        setUpdateState(prev => ({ ...prev, success: 'Ресурс видалено!' }));
        setTimeout(() => navigate('/resources', { 
          state: { deletedResourceId: resource.id } 
        }), 1000);
      } else {
        const updated = await resourceService.updateResource(resource.id, { quantity: val });
        setUpdateState(prev => ({ ...prev, success: 'Кількість успішно оновлено!' }));
        setResource(prev => ({ ...prev, quantity: updated.quantity }));
        setTimeout(() => {
          handleUpdateModalClose();
          navigate('/resources', { 
            state: { updatedResourceId: resource.id } 
          });
        }, 1000);
      }
    } catch (e) {
      setUpdateState(prev => ({
        ...prev,
        error: e.message || 'Помилка при оновленні',
        success: ''
      }));
    }
  }, [updateState.quantity, resource, navigate, handleUpdateModalClose]);

  const renderHeader = () => (
              <Box className="resource-details-header" mb={2}>
                <img
                  src={getImageUrl(resource.photo)}
                  alt={resource.name}
                  className="resource-details-image"
        onError={e => { e.target.src = notFoundImage }}
                />
                <Box className="resource-details-header-info">
        <Typography className="resource-details-title" gutterBottom>
          {resource.name}
        </Typography>
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
          <Typography className="resource-details-status-label">
            Статус: {STATUS_TRANSLATIONS[resource.status] || resource.status}
          </Typography>
                  )}
                </Box>
              </Box>
  );

  const renderQuantitySection = () => (
    <>
              <Typography className="resource-details-section-label">Кількість</Typography>
              <Box display="flex" alignItems="center" gap={2}>
        <Typography className="resource-details-quantity-detail" gutterBottom>
          {Number(resource.quantity) % 1 === 0 
            ? Number(resource.quantity) 
            : Number(resource.quantity).toFixed(2)} {resource.unit}
        </Typography>
                {isAuthenticated && (
          <Button 
            variant="outlined" 
            size="small" 
            color="primary" 
            onClick={handleUpdateModalOpen}
          >
            Оновити
          </Button>
                )}
              </Box>
    </>
  );

  const renderMetaInfo = () => (
              <Box className="resource-details-meta">
                {resource.added_by && (
                  <Typography className="resource-details-meta-item">
                    Додав: <b>{resource.added_by}</b>
                  </Typography>
                )}
                {resource.date_added && (
                  <Typography className="resource-details-meta-item">
          Дата додавання: <b>
            {new Date(resource.date_added).toLocaleString('uk-UA', { 
              day: '2-digit', 
              month: '2-digit', 
              year: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </b>
                  </Typography>
                )}
              </Box>
  );

  const renderUpdateModal = () => (
    <Dialog 
      open={updateState.modalOpen} 
      onClose={handleUpdateModalClose} 
      maxWidth="xs" 
      fullWidth
    >
            <DialogTitle>Оновити кількість ресурсу</DialogTitle>
            <DialogContent>
              <TextField
                label="Нова кількість"
                type="number"
          value={updateState.quantity}
          onChange={handleQuantityChange}
                fullWidth
                autoFocus
                margin="normal"
                inputProps={{ min: 0 }}
              />
        {updateState.error && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {updateState.error}
          </Alert>
        )}
        {updateState.success && (
          <Alert severity="success" sx={{ mt: 1 }}>
            {updateState.success}
          </Alert>
        )}
            </DialogContent>
            <DialogActions>
        <Button onClick={handleUpdateModalClose} color="secondary">
          Скасувати
        </Button>
        <Button 
          onClick={handleQuantityUpdate} 
          color="primary" 
          variant="contained"
        >
          Оновити
        </Button>
            </DialogActions>
          </Dialog>
  );

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography color="error" align="center">{error}</Typography>
      </Container>
    );
  }

  if (!resource) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box className="resource-details-box" sx={{ 
        background: 'rgba(255,255,255,0.95)', 
        borderRadius: 2, 
        p: 4, 
        boxShadow: 2 
      }}>
        {renderHeader()}
        
        <Divider className="resource-details-divider" />
        
        <Typography className="resource-details-section-label">Опис</Typography>
        <Typography className="resource-details-description" gutterBottom>
          {resource.comment || 'Опис відсутній'}
        </Typography>
        
        <Divider className="resource-details-divider" />
        
        {renderQuantitySection()}
        
        <Divider className="resource-details-divider" />
        
        {renderMetaInfo()}
      </Box>

      <Box 
        className="resource-details-back" 
        onClick={() => navigate('/resources')}
      >
        <ArrowBackIcon className="resource-details-back-icon" />
        <span className="resource-details-back-text">До списку ресурсів</span>
      </Box>

      {renderUpdateModal()}
        </Container>
  );
};

export default ResourceDetailsPage; 