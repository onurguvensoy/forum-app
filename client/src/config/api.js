const getApiUrl = () => {
  // Always return the API URL, regardless of environment
  return process.env.REACT_APP_API_URL || 'http://localhost:4000';
};

export const API_BASE_URL = getApiUrl();
export const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  auth: {
    verify: '/api/auth/verify',
    signup: '/api/auth/signup',
    login: '/api/auth/login',
    getUsername: '/api/auth/getusername',
  },
  entries: {
    base: '/api/entries',
    trending: '/api/entries/trending',
    getOne: (id) => `/api/entries/${id}`,
    reply: (id) => `/api/entries/${id}/reply`,
    like: (id) => `/api/entries/${id}/like`,
    dislike: (id) => `/api/entries/${id}/dislike`,
  },
}; 