// src/api/_authHeaders.js

// Откуда берём user — поправь, если ты хранишь не так.
function readUser() {
  try {
    const raw = localStorage.getItem('user'); // ожидание: {"id":123,"isSubscribed":true}
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Заголовки для бэка:
 *  - X-User-ID           (всегда, если знаем)
 *  - X-User-Subscribed   (для outline/submit/complete-lecture; для complete-section — не обязателен)
 */
export function getUserHeaders({ includeSubscribed = true } = {}) {
  const user = readUser();
  const headers = {};
  if (user?.id != null) headers['X-User-ID'] = user.id;
  if (includeSubscribed && user?.isSubscribed != null) {
    headers['X-User-Subscribed'] = Boolean(user.isSubscribed);
  }
  return headers;
}
