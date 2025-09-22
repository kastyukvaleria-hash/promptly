import api from './index.js';
import { getUserHeaders } from './_authHeaders.js';

const testService = {
  getTest: async (testId) => {
    const { data } = await api.get(`/courses/user/tests/${testId}`, {
      headers: getUserHeaders({ includeSubscribed: true }),
    });
    return data;
  },

  submitTest: async (testId, answers) => {
    const { data } = await api.post(
      `/courses/user/tests/${testId}/submit`,
      { selectedAnswers: answers },
      { headers: getUserHeaders({ includeSubscribed: true }) }
    );
    return data;
  },
};

export default testService;