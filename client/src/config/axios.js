import axios from 'axios';
import { API_BASE_URL, FRONTEND_URL } from './api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='));
    if (token) {
      config.headers.Authorization = `Bearer ${token.split('=')[1]}`;
    }

    // Add CORS headers in production
    if (process.env.NODE_ENV === 'production') {
      config.headers['Origin'] = FRONTEND_URL;
      config.headers['Access-Control-Allow-Origin'] = FRONTEND_URL;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access with correct base path
      const loginPath = process.env.NODE_ENV === 'production'
        ? `${FRONTEND_URL}/#/login`
        : '/login';
      window.location.href = loginPath;
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 