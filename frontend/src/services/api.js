import axios from 'axios';

// Base URL for all API calls - приклад URL для локального сервера
const API_BASE_URL = 'http://localhost:8000/api/';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to include the token in requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API service для операцій з волонтерами
const volunteerService = {
  // Реєстрація нового волонтера
  registerVolunteer: async (volunteerData) => {
    try {
      const formData = new FormData();
      
      // Маппінг полів з frontend до backend моделі
      const fieldMapping = {
        lastName: 'last_name',
        firstName: 'first_name',
        middleName: 'middle_name',
        phone: 'phone',
        email: 'email',
        telegramId: 'telegram_id',
        skills: 'skills',
        description: 'description',
        organization: 'organization',
        password: 'password'
      };
      
      // Логування даних, які надсилаються (без пароля)
      const logData = {...volunteerData};
      delete logData.password;
      delete logData.confirmPassword;
      console.log('Дані для реєстрації:', logData);
      
      // Додаємо всі текстові поля до formData з правильними іменами полів
      Object.keys(volunteerData).forEach(key => {
        if (key !== 'photoUrl' && key !== 'confirmPassword' && volunteerData[key] !== null) {
          const backendField = fieldMapping[key] || key;
          formData.append(backendField, volunteerData[key]);
          console.log(`Додано поле ${key} → ${backendField}: ${key === 'password' ? '******' : volunteerData[key]}`);
        }
      });
      
      // Додаємо фото, якщо воно є, з правильним іменем поля
      if (volunteerData.photoUrl) {
        formData.append('photo', volunteerData.photoUrl);
        console.log('Додано фото:', volunteerData.photoUrl.name);
      }
      
      // Для діагностики - виведемо всі поля FormData
      console.log('FormData містить наступні поля:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + (pair[0] === 'password' ? '******' : pair[1]));
      }
      
      console.log('Відправка даних на сервер для реєстрації...');
      try {
        const response = await api.post('/volunteers/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        console.log('Дані успішно надіслані на сервер:', response.data);
        
        // Якщо реєстрація успішна, відразу виконуємо вхід
        if (response.data && response.data.success) {
          // Оскільки бекенд не повертає токен при реєстрації, виконуємо вхід
          const loginData = {
            email: volunteerData.email,
            password: volunteerData.password
          };
          
          try {
            const loginResponse = await volunteerService.loginVolunteer(loginData);
            console.log('Автоматичний вхід після реєстрації:', loginResponse);
            return {
              ...response.data,
              autoLogin: true
            };
          } catch (loginError) {
            console.warn('Помилка автоматичного входу після реєстрації:', loginError);
            // Повертаємо дані реєстрації навіть якщо автовхід не вдався
            return response.data;
          }
        }
        
        return response.data;
      } catch (error) {
        console.error('Помилка запиту до сервера:', error);
        console.error('Статус:', error.response?.status);
        console.error('Відповідь сервера:', error.response?.data);
        
        // Повертаємо зрозуміле повідомлення про помилку
        if (error.response && error.response.data) {
          console.log('Деталі помилки від сервера:', error.response.data);
          
          if (typeof error.response.data === 'object') {
            // Детальний вивід всіх помилок валідації
            Object.keys(error.response.data).forEach(key => {
              console.error(`Помилка поля ${key}:`, error.response.data[key]);
            });
          }
          
          if (error.response.data.message) {
            throw new Error(error.response.data.message);
          } else if (error.response.data.email) {
            throw new Error(`Помилка з email: ${error.response.data.email}`);
          } else if (error.response.data.password) {
            throw new Error(`Помилка з паролем: ${error.response.data.password}`);
          } else if (typeof error.response.data === 'string') {
            throw new Error(error.response.data);
          }
        }
        
        throw error;
      }
    } catch (error) {
      console.error('Помилка при реєстрації волонтера:', error);
      throw error;
    }
  },
  
  // Вхід волонтера
  loginVolunteer: async (credentials) => {
    try {
      // Підготовка даних для запиту
      const loginData = {
        email: credentials.email,
        password: credentials.password
      };
      
      console.log('Спроба входу для користувача:', credentials.email);
      const response = await api.post('/volunteers/login/', loginData);
      
      if (response.data && response.data.token) {
        // Зберігаємо токен авторизації та дані користувача
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('currentUser', JSON.stringify(response.data.volunteer));
        
        console.log('Успішний вхід:', response.data.volunteer);
        
        return {
          success: true,
          message: 'Успішний вхід',
          token: response.data.token,
          volunteer: response.data.volunteer
        };
      }
      
      throw new Error('Неправильні дані автентифікації');
    } catch (error) {
      console.error('Помилка входу:', error);
      
      // Повертаємо зрозуміле повідомлення про помилку
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      
      throw error;
    }
  },
  
  // Вихід користувача
  logoutVolunteer: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  },
  
  // Перевірка чи авторизований користувач
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  // Отримання даних поточного користувача
  getCurrentUser: () => {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  },
  
  // Отримання списку волонтерів
  getVolunteers: async () => {
    try {
      // Спробуємо отримати дані з сервера
      try {
        const response = await api.get('/volunteers/');
        return response.data;
      } catch (serverError) {
        console.warn('Не вдалося з\'єднатися з сервером, використовуємо локальне сховище:', serverError);
        
        // Резервне отримання з локального сховища
        const volunteers = JSON.parse(localStorage.getItem('volunteers') || '[]');
        return {
          success: true,
          data: volunteers
        };
      }
    } catch (error) {
      console.error('Помилка отримання списку волонтерів:', error);
      throw error;
    }
  }
};

export { volunteerService };
export default api; 