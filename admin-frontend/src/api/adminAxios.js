import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const adminAxios = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// ADD TOKEN
adminAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// FIXED 401 HANDLING
adminAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // Agar 401 aaya but request sirf sidebar ke unseen-count/mark-seen ka ho → logout mat karo
    const url = error.config?.url || "";
    const safeUrls = [
      "/admin/orders/unseen-count/",
      "/admin/orders/mark-seen/",
    ];

    const isSafeRequest = safeUrls.some((u) => url.includes(u));

    if (status === 401 && !isSafeRequest) {
      localStorage.removeItem("admin_access_token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default adminAxios;
