import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      return Promise.reject(error.response.data);
    } else if (error.request) {
      return Promise.reject({
        success: false,
        error: 'Network Error',
        message: 'Unable to connect to the server',
      });
    } else {
      return Promise.reject({
        success: false,
        error: 'Error',
        message: error.message,
      });
    }
  }
);

// API Functions
export const getItems = () => apiClient.get('/items');

export const getItem = (id) => apiClient.get(`/items/${id}`);

export const createItem = (data) => apiClient.post('/items', data);

export const updateItem = (id, data) => apiClient.put(`/items/${id}`, data);

export const deleteItem = (id) => apiClient.delete(`/items/${id}`);

export const searchItems = (query) => apiClient.get('/items/search', { params: { q: query } });

export const healthCheck = () => apiClient.get('/health');

export default apiClient;
