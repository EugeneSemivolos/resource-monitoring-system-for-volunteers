import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

const MissionPage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom color="primary">
            Наша місія
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Про проєкт
          </Typography>
          <Typography paragraph>
            Система моніторингу ресурсів для волонтерів - це платформа, створена для оптимізації та 
            покращення процесу волонтерської допомоги. Наша мета - об'єднати волонтерів та ефективно 
            розподіляти ресурси там, де вони найбільш потрібні.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Наші цілі
          </Typography>
          <Typography component="div">
            <ul>
              <li>Створення єдиної платформи для координації волонтерської діяльності</li>
              <li>Оптимізація розподілу ресурсів та допомоги</li>
              <li>Забезпечення прозорості волонтерської діяльності</li>
              <li>Спрощення комунікації між волонтерами та організаціями</li>
              <li>Підвищення ефективності надання допомоги</li>
            </ul>
          </Typography>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            Наші принципи
          </Typography>
          <Typography paragraph>
            Ми віримо в прозорість, ефективність та відповідальність у волонтерській діяльності. 
            Кожен ресурс має бути використаний максимально ефективно, а кожна дія - принести 
            реальну користь тим, хто цього потребує.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default MissionPage; 