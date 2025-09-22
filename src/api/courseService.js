import api from './index.js';
import { getUserHeaders } from './_authHeaders.js';

const courseService = {
  getCourseOutline: async () => {
    const cacheBust = `?_cb=${Date.now()}`;
    // --- ИСПРАВЛЕНИЕ: Убираем только /api ---
    const { data } = await api.get(`/courses/user/outline${cacheBust}`, {
      headers: {
        ...getUserHeaders({ includeSubscribed: true }),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
    return data;
  },

  getCourseOutlineForce: async () => {
    const ts = Date.now();
    const rnd = Math.random().toString(36).slice(2);
    // --- ИСПРАВЛЕНИЕ: Убираем только /api ---
    const { data } = await api.get(`/courses/user/outline?_cb=${ts}&_r=${rnd}`, {
      headers: {
        ...getUserHeaders({ includeSubscribed: true }),
        'Cache-Control': 'no-cache, no-store, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
        'Surrogate-Control': 'no-store',
        'X-Force-Reload': 'true',
      },
    });
    return data;
  },

  getLectureContent: async (lectureId) => {
    // --- ИСПРАВЛЕНИЕ: Убираем только /api ---
    const { data } = await api.get(`/courses/user/lectures/${lectureId}`, {
      headers: getUserHeaders({ includeSubscribed: true }),
    });
    return data;
  },
};

export default courseService;