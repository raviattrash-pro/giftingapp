import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gift_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// To prevent multiple refresh requests simultaneously
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor to handle token expiry / unauthorized errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // If we're already trying to refresh, queue the request
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('gift_refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post((import.meta.env.VITE_API_BASE_URL || '/api') + '/auth/refresh', { refreshToken });
          const { accessToken, refreshToken: newRefreshToken } = res.data;
          
          localStorage.setItem('gift_token', accessToken || res.data.token);
          if (newRefreshToken) localStorage.setItem('gift_refresh_token', newRefreshToken);
          
          api.defaults.headers.common.Authorization = `Bearer ${accessToken || res.data.token}`;
          originalRequest.headers.Authorization = `Bearer ${accessToken || res.data.token}`;
          
          processQueue(null, accessToken || res.data.token);
          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          localStorage.removeItem('gift_token');
          localStorage.removeItem('gift_refresh_token');
          localStorage.removeItem('gift_user');
          window.dispatchEvent(new Event('auth-expired'));
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        localStorage.removeItem('gift_token');
        localStorage.removeItem('gift_refresh_token');
        localStorage.removeItem('gift_user');
        window.dispatchEvent(new Event('auth-expired'));
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
