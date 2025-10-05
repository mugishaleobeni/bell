// File: src/utils/api.ts

import axios from 'axios';

// 🛑 IMPORTANT: Replace with your actual backend URL 🛑
const BASE_URL = 'https://beltrandsmarketbackend.onrender.com'; 

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;