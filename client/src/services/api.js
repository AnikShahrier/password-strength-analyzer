import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request deduplication
const pending = new Map();

api.interceptors.response.use(
  (res) => {
    if (res.config._key) pending.delete(res.config._key);
    return res;
  },
  (err) => {
    if (err.config?._key) pending.delete(err.config._key);
    
    if (axios.isCancel(err)) {
      // Return a resolved promise with empty valid data
      return Promise.resolve({ 
        data: { 
          success: true, 
          data: [],
          pagination: { total: 0, limit: 20, offset: 0, hasMore: false }
        } 
      });
    }
    
    const msg = err.response?.data?.message || 'Network error';
    console.error('❌ API Error:', msg);
    return Promise.reject(new Error(msg));
  }
);

api.interceptors.response.use(
  (res) => {
    if (res.config._key) pending.delete(res.config._key);
    return res;
  },
  (err) => {
    if (err.config?._key) pending.delete(err.config._key);
    if (axios.isCancel(err)) return Promise.resolve({ data: {} });
    const msg = err.response?.data?.message || 'Network error';
    console.error('❌ API Error:', msg);
    return Promise.reject(new Error(msg));
  }
);

export const analyzePassword = async (password) => {
  const response = await api.post('/analysis/analyze', { password });
  return response.data;
};

export const revealPassword = async (id) => {
  const response = await api.post(`/analysis/${id}/reveal`);
  return response.data;
};

export const generatePassword = async () => {
  const response = await api.get('/analysis/generate');
  return response.data;
};

export const getLastPassword = async () => {
  const response = await api.get('/analysis/last');
  return response.data;
};

export const getHistory = async (limit = 50, offset = 0) => {
  const response = await api.get(`/analysis/history?limit=${limit}&offset=${offset}`);
  return response.data;
};

export const getStats = async () => {
  const response = await api.get('/analysis/stats');
  return response.data;
};

export const getAnalysisById = async (id) => {
  const response = await api.get(`/analysis/${id}`);
  return response.data;
};

export default api;