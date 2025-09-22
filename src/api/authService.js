import api from './index.js';

const authService = {
  /**
   * Отправляет запрос на регистрацию нового пользователя.
   */
  register: async (nickname, email, password) => {
    // Убираем /api, так как axios его добавит сам
    const { data } = await api.post('/users/auth/register', { nickname, email, password });
    return data;
  },

  /**
   * Отправляет запрос на вход пользователя в систему.
   */
  login: async (email, password) => {
    // Убираем /api
    const { data } = await api.post('/users/auth/login', { email, password });
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
   */
  forgotPassword: async (email) => {
    // Убираем /api
    await api.post('/users/auth/forgot-password', { email });
  },

  /**
   * Устанавливает новый пароль, используя токен сброса.
   */
  resetPassword: async (token, newPassword) => {
    // Убираем /api
    await api.post(`/users/auth/reset-password?token=${token}`, { newPassword });
  },
};

export default authService;