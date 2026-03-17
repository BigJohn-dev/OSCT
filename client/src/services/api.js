import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 15000,
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('osct_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('osct_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

// --- Convenience service modules ---

export const authService = {
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

export const userService = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  getContributions: (id, params) => api.get(`/users/${id}/contributions`, { params }),
};

export const projectService = {
  getAll: (params) => api.get('/projects', { params }),
  getFeatured: () => api.get('/projects/featured'),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  sync: (id) => api.post(`/projects/${id}/sync`),
};

export const contributionService = {
  getAll: (params) => api.get('/contributions', { params }),
  getById: (id) => api.get(`/contributions/${id}`),
  create: (data) => api.post('/contributions', data),
  update: (id, data) => api.put(`/contributions/${id}`, data),
  delete: (id) => api.delete(`/contributions/${id}`),
  review: (id, data) => api.put(`/contributions/${id}/review`, data),
};

export const leaderboardService = {
  get: (params) => api.get('/leaderboard', { params }),
  getStats: () => api.get('/leaderboard/stats'),
};

export const rewardService = {
  getAll: () => api.get('/rewards'),
  redeem: (rewardName) => api.post('/rewards/redeem', { rewardName }),
  getMyRedemptions: () => api.get('/rewards/my-redemptions'),
};
