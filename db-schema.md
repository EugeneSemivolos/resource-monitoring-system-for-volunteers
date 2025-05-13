# Схема бази даних для системи моніторингу ресурсів для волонтерів

## Таблиця `api_volunteers`

Таблиця для зберігання інформації про зареєстрованих волонтерів.

| Поле             | Тип даних       | Обмеження        | Опис                                   |
|------------------|-----------------|------------------|-----------------------------------------|
| id               | INT             | PRIMARY KEY, AUTO_INCREMENT | Унікальний ідентифікатор запису       |
| last_name        | VARCHAR(100)    | NOT NULL         | Прізвище волонтера                      |
| first_name       | VARCHAR(100)    | NOT NULL         | Ім'я волонтера                         |
| middle_name      | VARCHAR(100)    |                  | По батькові (необов'язкове)            |
| phone            | VARCHAR(20)     | NOT NULL         | Номер телефону                         |
| email            | VARCHAR(100)    | NOT NULL, UNIQUE | Електронна пошта (використовується для входу) |
| telegram_id      | VARCHAR(50)     |                  | Telegram ID (необов'язкове)            |
| skills           | TEXT            | NOT NULL         | Навички волонтера                      |
| description      | TEXT            | NOT NULL         | Опис себе як волонтера                 |
| organization     | VARCHAR(150)    | NOT NULL         | Організація, до якої належить волонтер |
| password_hash    | VARCHAR(255)    | NOT NULL         | Хеш пароля                             |
| photo_url        | VARCHAR(255)    |                  | URL до фото профілю (необов'язкове)    |
| created_at       | TIMESTAMP       | DEFAULT CURRENT_TIMESTAMP | Дата та час реєстрації             |
| updated_at       | TIMESTAMP       | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Дата та час останнього оновлення |
| status           | ENUM('active', 'inactive', 'pending') | DEFAULT 'active' | Статус аккаунта    |

## API Endpoints для роботи з волонтерами

### 1. Реєстрація нового волонтера
- URL: `/api/volunteers`
- Метод: `POST`
- Content-Type: `multipart/form-data`
- Поля запиту:
  - `lastName` (обов'язкове): Прізвище
  - `firstName` (обов'язкове): Ім'я
  - `middleName`: По батькові
  - `phone` (обов'язкове): Телефон
  - `email` (обов'язкове): Email
  - `telegramId`: Telegram ID
  - `skills` (обов'язкове): Навички
  - `description` (обов'язкове): Опис себе
  - `organization` (обов'язкове): Організація
  - `password` (обов'язкове): Пароль
  - `photo`: Файл фото (необов'язкове)

### 2. Вхід волонтера
- URL: `/api/volunteers/login`
- Метод: `POST`
- Content-Type: `application/json`
- Поля запиту:
  - `email` (обов'язкове): Email
  - `password` (обов'язкове): Пароль

### 3. Отримання списку волонтерів
- URL: `/api/volunteers`
- Метод: `GET`
- Параметри запиту:
  - `page`: Номер сторінки для пагінації
  - `limit`: Кількість записів на сторінку
  - `skills`: Фільтр за навичками
  - `organization`: Фільтр за організацією

### 4. Отримання інформації про конкретного волонтера
- URL: `/api/volunteers/:id`
- Метод: `GET`

### 5. Оновлення інформації про волонтера
- URL: `/api/volunteers/:id`
- Метод: `PUT`
- Content-Type: `multipart/form-data`
- Поля запиту: Такі самі як при реєстрації

### 6. Деактивація аккаунта волонтера
- URL: `/api/volunteers/:id/status`
- Метод: `PATCH`
- Content-Type: `application/json`
- Поля запиту:
  - `status` (обов'язкове): Новий статус ('active', 'inactive', 'pending') 