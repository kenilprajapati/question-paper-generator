import axios from 'axios';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';

const API_BASE_URL = 'http://localhost:5000/api/v1';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding JWT
axiosInstance.interceptors.request.use(
  (config) => {
    // Read directly from localStorage for maximum reliability during state transitions
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't redirect if we are already on the login page
      const isLoginPath = window.location.pathname === '/' || window.location.pathname === '/login';
      
      if (!isLoginPath) {
        store.dispatch(logout());
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
