import React, { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import progressService from '../../api/progressService.js';

/**
 * Фоновый менеджер: делает daily check-in максимум 1 раз в КАЛЕНДАРНЫЕ сутки.
 * Ничего не рендерит, просто живёт в корне приложения.
 */
const DailyStreakManager = () => {
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const run = async () => {
      if (!isLoggedIn) return;

      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const key = 'dailyCheckInDate';
      const last = localStorage.getItem(key);
      if (last === today) return;

      try {
        await progressService.dailyCheckIn();
        localStorage.setItem(key, today);
      } catch (e) {
        console.error('Daily check-in failed:', e);
      }
    };

    run();
  }, [isLoggedIn]);

  return null;
};

export default DailyStreakManager;
