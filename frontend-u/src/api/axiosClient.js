// src/api/axiosClient.js
import axios from "axios";

// 🌐 Base URL deploy + local friendly
// .env me VITE_API_URL set kar sakte ho:
// VITE_API_URL=https://your-domain.com/api
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Automatically attach JWT token to all requests
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto logout on 401
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      // optional: window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
