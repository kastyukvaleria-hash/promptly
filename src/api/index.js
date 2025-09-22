import axios from 'axios';

// 1. Читаем базовый URL из переменной окружения
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  alert("Критическая ошибка: VITE_API_BASE_URL не определена в .env файле!");
}

const api = axios.create({
  // 2. Устанавливаем базовый URL, который мы прочитали
  baseURL: API_BASE_URL,
  
  // 3. Весь остальной "пуленепробиваемый" код твоего друга
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Accept': 'application/json',
  },
});

function getAuthToken() {
  try {
    return localStorage.getItem('authToken') || '';
  } catch {
    return '';
  }
}

function isPublicRoute(url = '') {
  try {
    // Эта проверка правильная, так как все публичные роуты содержат /auth/
    return typeof url === 'string' && url.includes('/users/auth/');
  } catch {
    return false;
  }
}

api.interceptors.request.use(
  (config) => {
    const url = config?.url || '';
    const token = getAuthToken();

    // Эта логика тоже абсолютно правильная
    if (token && !isPublicRoute(url)) {
      if (!config.headers) config.headers = {};
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error?.config?.url ?? 'Unknown URL';
    const status = error?.response?.status;
    const payload = error?.response?.data;
    // Используем его надежное логирование
    console.error(`[AXIOS ERROR] ${status || 'NO_STATUS'} @ ${API_BASE_URL}${url}`, payload);
    return Promise.reject(error);
  }
);

export default api;