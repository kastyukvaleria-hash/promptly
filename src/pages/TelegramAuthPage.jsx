// src/pages/TelegramAuthPage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './LoginPage.module.css'; // Используем стили от страницы логина для загрузчика

const TelegramAuthPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = async () => {
      try {
        // 1. Проверяем, что мы внутри Telegram
        if (window.Telegram && window.Telegram.WebApp) {
          const tg = window.Telegram.WebApp;
          tg.ready(); // Сообщаем Telegram, что приложение готово
          
          const initData = tg.initData;

          if (!initData) {
            throw new Error('Telegram initData не найдены.');
          }

          // 2. Отправляем данные на бэкенд Данилы
          // Убедись, что VITE_API_BASE_URL в твоем .env файле указывает на https://api.promtly.by
          const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.promtly.by';
          const response = await axios.post(`${API_BASE_URL}/auth/telegram`, {
            initData: initData
          });

          const token = response.data.token;
          if (!token) {
            throw new Error('Бэкенд не вернул токен.');
          }

          // 3. Сохраняем токен и переходим на главную
          localStorage.setItem("authToken", token);
          
          // Перезагружаем страницу, чтобы все контексты (AuthContext, CourseContext) обновились
          window.location.href = '/';

        } else {
          // Если зайти по прямой ссылке, а не из ТГ
          console.warn('Приложение запущено не через Telegram. Перенаправляем на логин.');
          navigate('/login');
        }
      } catch (error) {
        console.error('Ошибка авторизации через Telegram:', error);
        // Если что-то пошло не так, кидаем на обычную страницу логина
        navigate('/login');
      }
    };

    auth();
  }, [navigate]);

  // Пока идет процесс, показываем красивый загрузчик
  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <h3 style={{color: 'white', textAlign: 'center'}}>Авторизация через Telegram...</h3>
      </div>
    </div>
  );
};

export default TelegramAuthPage;