import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
});

axiosInstance.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('token');
    const xAuthToken = localStorage.getItem('x-auth-token');
    if(!token) {
      token = localStorage.getItem('x-auth-token');
    }

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      config.headers['x-auth-token'] = token;
    }

    if (xAuthToken) {
      config.headers['Authorization'] = `Bearer ${xAuthToken}`;
      config.headers['x-auth-token'] = xAuthToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;