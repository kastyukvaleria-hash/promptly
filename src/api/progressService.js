import api from './index.js';
import { getUserHeaders } from './_authHeaders.js';

/**
 * ВАЖНО:
 * - /stats/check-in требует X-User-ID (добавляем через getUserHeaders).
 * - complete-lecture — тоже X-User-ID и X-User-Subscribed.
 * - complete-section — X-User-ID обязателен; подписка не нужна.
 */
const progressService = {
  // Отмечаем «активный день» (увеличит totalActiveDays и consecutiveDays)
  dailyCheckIn: async () => {
    // Убираем /api
    await api.post('/progress/stats/check-in', null, {
      headers: getUserHeaders({ includeSubscribed: true }),
    });
  },

  // Завершение лекции
  completeLecture: async (lectureId, sectionId) => {
    // Убираем /api
    await api.post(
      '/progress/complete-lecture',
      { lectureId: Number(lectureId), sectionId: Number(sectionId) },
      { headers: getUserHeaders({ includeSubscribed: true }) }
    );
  },

  // Завершение раздела
  completeSection: async (sectionOrderIndex, sectionId) => {
    // Убираем /api
    await api.post(
      '/progress/complete-section',
      { sectionId: Number(sectionId), sectionOrderIndex: Number(sectionOrderIndex) },
      { headers: getUserHeaders({ includeSubscribed: false }) }
    );
  },

  /**
   * НЕОБЯЗАТЕЛЬНО. Удобно для ручной проверки из UI/консоли,
   * если /internal не режется гейтвеем в dev.
   */
  getUserStatsUnsafe: async (userId) => {
    // Убираем /api
    const { data } = await api.get(`/progress/internal/stats/users/${userId}`, {
      headers: getUserHeaders({ includeSubscribed: false }),
    });
    return data;
  },
};

export default progressService;