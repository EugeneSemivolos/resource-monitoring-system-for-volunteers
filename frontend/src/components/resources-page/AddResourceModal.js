import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem, Snackbar, Alert, Box, Typography } from '@mui/material';
import { resourceService } from '../../services/api';
import { useUser } from '../../contexts/UserContext';

const CATEGORY_OPTIONS = [
  'медичні засоби',
  'спорядження',
  'продукти',
  'обладнання',
  'одяг',
  'інше'
];

const AddResourceModal = ({ open, onClose, onResourceAdded }) => {
  const { user } = useUser();
  const [form, setForm] = useState({
    name: '',
    category: '',
    quantity: '',
    unit: '',
    storage_location: '',
    comment: '',
    photo: null,
    organization: '',
    added_by: user ? `${user.firstName} ${user.lastName}` : ''
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm(prev => ({ ...prev, photo: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    if (!form.name || !form.category || !form.quantity || !form.unit || !form.storage_location || !form.organization) {
      setError('Будь ласка, заповніть всі обовʼязкові поля.');
      return false;
    }
    if (isNaN(Number(form.quantity)) || Number(form.quantity) <= 0) {
      setError('Кількість має бути додатнім числом.');
      return false;
    }
    if (!user) {
      setError('Помилка: користувач не авторизований.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const formData = {
        ...form,
        added_by: user ? `${user.firstName} ${user.lastName}` : ''
      };
      const newResource = await resourceService.addResource(formData);
      if (onResourceAdded) onResourceAdded(newResource);
      onClose();
    } catch (err) {
      setError(err.message || 'Помилка при додаванні ресурсу.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setForm({ name: '', category: '', quantity: '', unit: '', storage_location: '', comment: '', photo: null, organization: '', added_by: user ? `${user.firstName} ${user.lastName}` : '' });
    setPhotoPreview(null);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>Додати новий ресурс</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            label="Назва ресурсу"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            select
            label="Категорія"
            name="category"
            value={form.category}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          >
            {CATEGORY_OPTIONS.map(option => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </TextField>
          <Box display="flex" gap={2}>
            <TextField
              label="Кількість"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              type="number"
              required
              margin="normal"
              fullWidth
            />
            <TextField
              label="Одиниця виміру"
              name="unit"
              value={form.unit}
              onChange={handleChange}
              required
              margin="normal"
              fullWidth
            />
          </Box>
          <TextField
            label="Локація зберігання"
            name="storage_location"
            value={form.storage_location}
            onChange={handleChange}
            required
            margin="normal"
            fullWidth
          />
          <TextField
            label="Організація"
            name="organization"
            value={form.organization}
            onChange={handleChange}
            required
            margin="normal"
            fullWidth
          />
          <TextField
            label="Опис (необовʼязково)"
            name="comment"
            value={form.comment}
            onChange={handleChange}
            margin="normal"
            fullWidth
            multiline
            minRows={2}
          />
          <Box mt={2} mb={1}>
            <Typography variant="body2">Фото (необовʼязково):</Typography>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="resource-photo-upload"
              type="file"
              onChange={handlePhotoChange}
            />
            <label htmlFor="resource-photo-upload">
              <Button variant="outlined" component="span">Завантажити фото</Button>
            </label>
            {photoPreview && (
              <Box mt={1}><img src={photoPreview} alt="Превʼю" style={{ maxWidth: 120, maxHeight: 120, borderRadius: 8 }} /></Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="secondary">Скасувати</Button>
          <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Додається...' : 'Додати'}
          </Button>
        </DialogActions>
      </form>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default AddResourceModal; 