import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import userService from '../../api/userService.js';
import progressService from '../../api/progressService.js';
import StreakModal from '../common/StreakModal.jsx';

// Функция для получения сегодняшней даты в формате 'YYYY-MM-DD'
const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0];
};

const DailyStreakManager = () => {
  const { isLoggedIn } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [streakDays, setStreakDays] = useState(0);

  useEffect(() => {
    const checkStreak = async () => {
      // Ключ для sessionStorage, чтобы показывать окно только раз за сессию
      const sessionKey = 'streakModalShown';
      const alreadyShown = sessionStorage.getItem(sessionKey);

      // Если пользователь не авторизован или окно уже показывали, ничего не делаем
      if (!isLoggedIn || alreadyShown) {
        return;
      }

      try {
        // 1. Выполняем "чекин". Бэкенд обновит серию, если нужно.
        await progressService.dailyCheckIn();
        
        // 2. Получаем СВЕЖИЕ данные профиля ПОСЛЕ чекина.
        const profile = await userService.getProfile();
        
        // 3. Анализируем ответ
        const today = getTodayDateString();

        // Если дата последнего входа - СЕГОДНЯ, и серия больше 1, значит, мы ее продлили
        if (profile.lastLoginDate === today && profile.consecutiveDays > 1) {
          setStreakDays(profile.consecutiveDays);
          setShowModal(true);
          sessionStorage.setItem(sessionKey, 'true'); // Ставим флаг, что показали
        } 
        // TODO: Сюда можно будет добавить логику для потерянной серии
        // else if (profile.consecutiveDays === 1 && ... ) { ... }

      } catch (error) {
        console.error("Не удалось проверить серию:", error);
      }
    };

    checkStreak();
  }, [isLoggedIn]); // Этот useEffect сработает один раз, когда isLoggedIn станет true

  return (
    <StreakModal 
      isOpen={showModal} 
      onClose={() => setShowModal(false)}
      streakDays={streakDays}
    />
  );
};

export default DailyStreakManager;