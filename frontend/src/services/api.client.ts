import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9000';

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para logs y manejo de errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message;
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);
