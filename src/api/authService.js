import api from './index.js';

const authService = {
  /**
   * Отправляет запрос на регистрацию нового пользователя.
   * @param {string} nickname - Никнейм пользователя.
   * @param {string} email - Email пользователя.
   * @param {string} password - Пароль пользователя.
   * @returns {Promise<{token: string}>} - Объект с JWT токеном.
   */
  register: async (nickname, email, password) => {
    const { data } = await api.post('/api/users/auth/register', { nickname, email, password });
    return data;
  },

  /**
   * Отправляет запрос на вход пользователя в систему.
   * @param {string} email - Email пользователя.
   * @param {string} password - Пароль пользователя.
   * @returns {Promise<{token: string}>} - Объект с JWT токеном.
   */
  login: async (email, password) => {
    const { data } = await api.post('/api/users/auth/login', { email, password });
    return data;
  },

  /**
   * Удаляет токен из localStorage.
   */
  logout: () => {
    localStorage.removeItem('authToken');
  },

  /**
   * Отправляет запрос на сброс пароля для указанного email.
   * @param {string} email - Email пользователя.
   * @returns {Promise<void>}
   */
  forgotPassword: async (email) => {
    await api.post('/api/users/auth/forgot-password', { email });
  },

  /**
   * Устанавливает новый пароль, используя токен сброса.
   * @param {string} token - Токен из ссылки в письме.
   * @param {string} newPassword - Новый пароль пользователя.
   * @returns {Promise<void>}
   */
  resetPassword: async (token, newPassword) => {
    await api.post(`/api/users/auth/reset-password?token=${token}`, { newPassword });
  },
};

export default authService;