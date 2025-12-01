import userAxios from "./userAxios";

// AUTH
export const userLogin = (data) =>
  userAxios.post("/auth/login/", data);

export const registerUser = (data) =>
  userAxios.post("/auth/register/", data);

export const getProfile = () =>
  userAxios.get("/auth/profile/");

export const updateProfile = (data) =>
  userAxios.put("/auth/profile/", data);

// PRODUCTS
export const getAllProducts = (params = {}) =>
  userAxios.get("/products/", { params });

export const getProductDetail = (slug) =>
  userAxios.get(`/products/${slug}/`);

export const createReview = (slug, data) =>
  userAxios.post(`/products/${slug}/reviews/`, data);

// ORDERS
export const createOrder = (data) =>
  userAxios.post("/orders/create/", data);

export const getUserOrders = () =>
  userAxios.get("/orders/");

export const getUserOrderDetail = (orderNumber) =>
  userAxios.get(`/orders/${orderNumber}/`);

export const trackOrder = (params) =>
  userAxios.get("/orders/track/", { params });

// PAYMENTS
export const createRazorpayOrder = (data) =>
  userAxios.post("/payments/create-order/", data);

export const verifyRazorpayPayment = (data) =>
  userAxios.post("/payments/verify/", data);

// WISHLIST
export const getWishlist = () =>
  userAxios.get("/wishlist/");

export const toggleWishlist = (productId) =>
  userAxios.post(`/wishlist/toggle/${productId}/`);
