import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3216/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach token from localStorage
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Attach token as Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.error('Unauthorized or forbidden request.');
      // Handle logout or redirect to login page if necessary
    }
    return Promise.reject(error);
  }
);

export default instance;
