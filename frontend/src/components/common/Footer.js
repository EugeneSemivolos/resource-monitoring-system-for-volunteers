import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box component="footer" className="footer">
      <Container maxWidth="lg">
        <Box className="footer-content">
          <Box className="footer-section">
            <Typography variant="h6" gutterBottom>
              Система моніторингу ресурсів
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Платформа для ефективної координації волонтерської допомоги
            </Typography>
          </Box>

          <Box className="footer-section">
            <Typography variant="h6" gutterBottom>
              Контакти
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Email: support@volunteer-system.com
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Телефон: +38 (044) 123-45-67
            </Typography>
          </Box>

          <Box className="footer-section">
            <Typography variant="h6" gutterBottom>
              Посилання
            </Typography>
            <Link href="/resources" color="inherit">
              Ресурси
            </Link>
            <Link href="/volunteers" color="inherit">
              Волонтери
            </Link>
            <Link href="/mission" color="inherit">
              Про проєкт
            </Link>
          </Box>
        </Box>

        <Box className="footer-bottom">
          <Typography variant="body2" color="textSecondary" align="center">
            © {currentYear} Система моніторингу ресурсів. Всі права захищено.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 