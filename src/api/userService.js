import api from './index.js';

const userService = {
  getProfile: async () => {
    // Возвращаем /users, чтобы компенсировать @RequestMapping
    const { data } = await api.get('/api/users/users/profile');
    return data;
  },
  
  getPrompts: async () => {
    // Возвращаем /users здесь тоже
    const { data } = await api.get('/api/users/users/profile/prompts');
    return data;
  },

  updateAvatar: async (avatarId) => {
    // И здесь тоже
    await api.put('/api/users/users/profile/avatar', { avatarId });
  },

  // --- ВОТ ДОБАВЛЕННЫЙ МЕТОД С ПРАВИЛЬНЫМ URL ---
  /**
   * Привязывает email и пароль к текущему Telegram-аккаунту
   * или выполняет слияние с существующим.
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<void>}
   */
  linkAccount: async (email, password) => {
    // Добавляем префикс /users и сюда
    await api.post('/api/users/users/profile/link-account', { email, password });
  },
};

export default userService;