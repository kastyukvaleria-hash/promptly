import axios from 'axios';

// 1. Читаем базовый URL из переменной окружения
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  alert("Критическая ошибка: VITE_API_BASE_URL не определена в .env файле!");
}

const api = axios.create({
  // 2. Устанавливаем базовый URL, который мы прочитали
  baseURL: API_BASE_URL,
  
  // 3. Весь остальной "пуленепробиваемый" код
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
    return typeof url === 'string' && url.includes('/users/auth/');
  } catch {
    return false;
  }
}

api.interceptors.request.use(
  (config) => {
    const url = config?.url || '';
    const token = getAuthToken();

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

// --- НАЧАЛО ГЛАВНОГО ИСПРАВЛЕНИЯ ---
api.interceptors.response.use(
  // Если ответ успешный, просто возвращаем его
  (response) => response,
  
  // Если произошла ошибка
  (error) => {
    // Проверяем, есть ли вообще ответ от сервера и какой у него статус
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // ОШИБКА 401 (Unauthorized) или 403 (Forbidden) - это значит, что токен невалидный или истек.
      
      console.error("Перехвачена ошибка авторизации (401/403). Выполняем выход...");
      
      // 1. Удаляем невалидный токен из хранилища
      localStorage.removeItem('authToken');
      
      // 2. Принудительно перезагружаем страницу и отправляем на логин.
      // Это самый надежный способ полностью сбросить состояние приложения.
      window.location.href = '/login';
    }
    
    // Для всех остальных ошибок, просто логируем их и пробрасываем дальше
    const url = error?.config?.url ?? 'Unknown URL';
    const status = error?.response?.status;
    const payload = error?.response?.data;
    console.error(`[AXIOS ERROR] ${status || 'NO_STATUS'} @ ${API_BASE_URL}${url}`, payload);
    
    return Promise.reject(error);
  }
);
// --- КОНЕЦ ГЛАВНОГО ИСПРАВЛЕНИЯ ---

export default api;
