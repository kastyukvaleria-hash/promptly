import api from './index.js';

const adminService = {
  // === РАЗДЕЛЫ (SECTIONS) ===
  getAllSections: async () => {
    const { data } = await api.get('/courses/admin/sections');
    return data;
  },
  getSectionById: async (sectionId) => {
    const { data } = await api.get(`/courses/admin/sections/${sectionId}`);
    return data;
  },
  createSection: async (sectionData) => {
    const { data } = await api.post('/courses/admin/sections', sectionData);
    return data;
  },
  updateSection: async (sectionId, sectionData) => {
    const { data } = await api.put(`/courses/admin/sections/${sectionId}`, sectionData);
    return data;
  },
  deleteSection: async (sectionId) => {
    await api.delete(`/courses/admin/sections/${sectionId}`);
  },

  // === ГЛАВЫ (CHAPTERS) ===
  createChapter: async (sectionId, chapterData) => {
    const { data } = await api.post(`/courses/admin/sections/${sectionId}/chapters`, chapterData);
    return data;
  },
  updateChapter: async (chapterId, chapterData) => {
    const { data } = await api.put(`/courses/admin/chapters/${chapterId}`, chapterData);
    return data;
  },
  deleteChapter: async (chapterId) => {
    await api.delete(`/courses/admin/chapters/${chapterId}`);
  },

  // === ЛЕКЦИИ (LECTURES) ===
  getLecturesByChapterId: async (chapterId) => {
    const { data } = await api.get(`/courses/admin/chapters/${chapterId}/lectures`);
    return data;
  },
  createLecture: async (chapterId, lectureData) => {
    const { data } = await api.post(`/courses/admin/chapters/${chapterId}/lectures`, lectureData);
    return data;
  },
  updateLecture: async (lectureId, lectureData) => {
    const { data } = await api.put(`/courses/admin/lectures/${lectureId}`, lectureData);
    return data;
  },
  deleteLecture: async (lectureId) => {
    await api.delete(`/courses/admin/lectures/${lectureId}`);
  },
  
  // === ПРОМПТЫ (PROMPTS) ===
  getPromptsByLectureId: async (lectureId) => {
    const { data } = await api.get(`/courses/admin/lectures/${lectureId}/prompts`);
    return data;
  },
  createPrompt: async (lectureId, promptData) => {
    const { data } = await api.post(`/courses/admin/lectures/${lectureId}/prompts`, promptData);
    return data;
  },
  updatePrompt: async (promptId, promptData) => {
    const { data } = await api.put(`/courses/admin/prompts/${promptId}`, promptData);
    return data;
  },
  deletePrompt: async (promptId) => {
    await api.delete(`/courses/admin/prompts/${promptId}`);
  },

  // === ТЕСТЫ (TESTS) ===
  getTestByLectureId: async (lectureId) => {
    const { data } = await api.get(`/courses/admin/lectures/${lectureId}/test`);
    return data;
  },
  getTestByChapterId: async (chapterId) => {
    const { data } = await api.get(`/courses/admin/chapters/${chapterId}/test`);
    return data;
  },
  getTestBySectionId: async (sectionId) => {
    const { data } = await api.get(`/courses/admin/sections/${sectionId}/test`);
    return data;
  },
  createOrUpdateTestForLecture: async (lectureId, testData) => {
    const { data } = await api.post(`/courses/admin/lectures/${lectureId}/test`, testData);
    return data;
  },
  createOrUpdateTestForChapter: async (chapterId, testData) => {
    const { data } = await api.post(`/courses/admin/chapters/${chapterId}/test`, testData);
    return data;
  },
  createOrUpdateTestForSection: async (sectionId, testData) => {
    const { data } = await api.post(`/courses/admin/sections/${sectionId}/test`, testData);
    return data;
  },
  deleteTest: async (testId) => {
    await api.delete(`/courses/admin/tests/${testId}`);
  },
};

export default adminService;