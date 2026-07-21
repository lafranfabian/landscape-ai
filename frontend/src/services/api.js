import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const predictionService = {
  predict: async (data) => {
    const response = await api.post('/predict', data);
    return response.data;
  },
  
  getHistory: async (search = '', province = '', favoritesOnly = false) => {
    const params = {};
    if (search) params.search = search;
    if (province) params.province = province;
    if (favoritesOnly) params.favorites_only = favoritesOnly;
    
    const response = await api.get('/history', { params });
    return response.data;
  },
  
  deleteHistory: async (id) => {
    const response = await api.delete(`/history/${id}`);
    return response.data;
  },
  
  toggleFavorite: async (id) => {
    const response = await api.patch(`/history/${id}/favorite`);
    return response.data;
  },
  
  getDashboardStats: async () => {
    const response = await api.get('/dashboard');
    return response.data;
  },
  
  getModelInfo: async () => {
    const response = await api.get('/model-info');
    return response.data;
  }
};

export default api;
