import axios from 'axios';

// Create an Axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add authentication header if available
axiosInstance.interceptors.request.use(
  (config) => {
    const authHeader = localStorage.getItem('auth_header');
    if (authHeader) {
      config.headers.Authorization = `Basic ${authHeader}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle authentication errors
      if (error.response.status === 401) {
        localStorage.removeItem('auth_header');
        window.location.href = '/login';
      }

      // Handle unauthorized access
      if (error.response.status === 403) {
        console.error('Access forbidden');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
