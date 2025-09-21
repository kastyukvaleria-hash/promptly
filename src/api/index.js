// src/api/index.js
import axios from 'axios';

/**
 * Базовый инстанс Axios.
 * baseURL не задаём — Vite proxy сам прокидывает /api/* на нужный бэкенд.
 * withCredentials включаем на случай cookie (если не нужны — можно убрать).
 */
const api = axios.create({
  baseURL: '',
  withCredentials: true,
  timeout: 30000, // чтобы не висеть бесконечно на сетевых глюках
  headers: {
    'Accept': 'application/json',
  },
});

/**
 * Безопасное чтение токена из localStorage
 */
function getAuthToken() {
  try {
    return localStorage.getItem('authToken') || '';
  } catch {
    return '';
  }
}

/**
 * Явно определяем "публичные" роуты, куда не надо слать Authorization
 * (у тебя это всё, что содержит /api/users/auth/).
 */
function isPublicRoute(url = '') {
  try {
    // url может быть относительным (/api/...), абсолютным (http...), или пустым
    return typeof url === 'string' && url.includes('/api/users/auth/');
  } catch {
    return false;
  }
}

/**
 * REQUEST interceptor:
 *  - добавляем Authorization: Bearer <token> для НЕпубличных ручек
 */
api.interceptors.request.use(
  (config) => {
    const url = config?.url || '';
    const token = getAuthToken();

    if (token && !isPublicRoute(url)) {
      // Не перетираем, если кто-то уже явно поставил заголовок выше по стеку
      if (!config.headers) config.headers = {};
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * RESPONSE interceptor:
 *  - логируем ошибки с адресом и статусом
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error?.config?.url ?? 'Unknown URL';
    const status = error?.response?.status;
    const payload = error?.response?.data;

    // Этот лог помогает быстро ловить, что именно упало
    console.error(`[AXIOS ERROR] ${status || 'NO_STATUS'} @ ${url}`, payload);

    // Прокидываем дальше, чтобы вызывать .catch() в сервисах
    return Promise.reject(error);
  }
);

export default api;
