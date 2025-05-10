import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Создаем тему с настроенными шрифтами
const theme = createTheme({
  typography: {
    fontFamily: '"Source Sans 3", "Open Sans", sans-serif',
    fontSize: 14,
    h1: {
      fontFamily: '"Source Sans 3", "Open Sans", sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Source Sans 3", "Open Sans", sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Source Sans 3", "Open Sans", sans-serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Source Sans 3", "Open Sans", sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Source Sans 3", "Open Sans", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Source Sans 3", "Open Sans", sans-serif',
      fontWeight: 500,
    },
    body1: {
      fontFamily: 'Nunito, "Open Sans", sans-serif',
      lineHeight: 1.6,
      letterSpacing: '0.015em',
    },
    body2: {
      fontFamily: 'Nunito, "Open Sans", sans-serif',
      lineHeight: 1.6,
    },
    button: {
      fontFamily: '"Source Sans 3", "Open Sans", sans-serif',
      fontWeight: 600,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
