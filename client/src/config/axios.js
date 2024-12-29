import axios from 'axios';
import { API_BASE_URL } from './api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add auth token and handle base path
axiosInstance.interceptors.request.use(
  (config) => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='));
    if (token) {
      config.headers.Authorization = `Bearer ${token.split('=')[1]}`;
    }

    // Add base path for production
    if (process.env.NODE_ENV === 'production') {
      config.url = `${process.env.REACT_APP_BASE_PATH}${config.url}`;
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
      // Handle unauthorized access
      window.location.href = process.env.NODE_ENV === 'production' 
        ? `${process.env.REACT_APP_BASE_PATH}/login`
        : '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 