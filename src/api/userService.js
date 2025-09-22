import api from './index.js';

const userService = {
  getProfile: async () => {
    // Убираем /api, оставляем /users/users...
    const { data } = await api.get('/users/users/profile');
    return data;
  },
  
  getPrompts: async () => {
    // Убираем /api
    const { data } = await api.get('/users/users/profile/prompts');
    return data;
  },

  updateAvatar: async (avatarId) => {
    // Убираем /api
    await api.put('/users/users/profile/avatar', { avatarId });
  },

  /**
   * Привязывает email и пароль к текущему Telegram-аккаунту
   * или выполняет слияние с существующим.
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<void>}
   */
  linkAccount: async (email, password) => {
    // Убираем /api
    await api.post('/users/users/profile/link-account', { email, password });
  },
};

export default userService;