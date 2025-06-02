import React, { memo } from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

const MISSION_CONTENT = {
  title: 'Наша місія',
  sections: {
    about: {
      title: 'Про проєкт',
      content: `Система моніторингу ресурсів для волонтерів - це платформа, створена для оптимізації та 
        покращення процесу волонтерської допомоги. Наша мета - об'єднати волонтерів та ефективно 
        розподіляти ресурси там, де вони найбільш потрібні.`
    },
    goals: {
      title: 'Наші цілі',
      items: [
        'Створення єдиної платформи для координації волонтерської діяльності',
        'Оптимізація розподілу ресурсів та допомоги',
        'Забезпечення прозорості волонтерської діяльності',
        'Спрощення комунікації між волонтерами та організаціями',
        'Підвищення ефективності надання допомоги'
      ]
    },
    principles: {
      title: 'Наші принципи',
      content: `Ми віримо в прозорість, ефективність та відповідальність у волонтерській діяльності. 
        Кожен ресурс має бути використаний максимально ефективно, а кожна дія - принести 
        реальну користь тим, хто цього потребує.`
    }
  }
};

const MissionPage = () => {
  const renderSection = (section, type = 'text') => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        {section.title}
      </Typography>
      {type === 'list' ? (
        <Typography component="div">
          <ul>
            {section.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </Typography>
      ) : (
        <Typography paragraph>
          {section.content}
        </Typography>
      )}
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: 2
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            color="primary"
          >
            {MISSION_CONTENT.title}
          </Typography>
        </Box>

        {renderSection(MISSION_CONTENT.sections.about)}
        {renderSection(MISSION_CONTENT.sections.goals, 'list')}
        {renderSection(MISSION_CONTENT.sections.principles)}
      </Paper>
    </Container>
  );
};

export default memo(MissionPage); 