const isDevelopment = process.env.NODE_ENV === 'development';

const config = {
  API_URL: isDevelopment 
    ? 'http://localhost:4000/api' 
    : 'https://your-backend-url.onrender.com/api',
  SOCKET_URL: isDevelopment
    ? 'ws://localhost:4000'
    : 'wss://your-backend-url.onrender.com'
};

export default config; 