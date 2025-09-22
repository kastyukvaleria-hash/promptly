import { jwtDecode } from 'jwt-decode';

/**
 * Читает токен из localStorage, декодирует его и возвращает заголовки для бэка.
 *  - X-User-ID           (ID пользователя из токена)
 *  - X-User-Subscribed   (статус подписки из токена)
 */
export function getUserHeaders({ includeSubscribed = true } = {}) {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) return {};

    const decodedToken = jwtDecode(token);
    const headers = {};

    if (decodedToken.userId) {
      headers['X-User-ID'] = decodedToken.userId;
    }
    if (includeSubscribed && decodedToken.isSubscribed !== undefined) {
      headers['X-User-Subscribed'] = decodedToken.isSubscribed;
    }
    
    return headers;
  } catch (error) {
    console.error("Failed to decode token or get user headers:", error);
    return {};
  }
}