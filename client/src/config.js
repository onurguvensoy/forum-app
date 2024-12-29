const config = {
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api',
  SOCKET_URL: process.env.REACT_APP_SOCKET_URL || 'ws://localhost:4000'
};

export default config; 