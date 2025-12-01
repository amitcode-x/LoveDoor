import adminAxios from "./adminAxios";

/* ============================================================
   🔐 AUTH
============================================================ */
export const adminLogin = (data) =>
  adminAxios.post("/auth/login/", data);

/* ============================================================
   📊 DASHBOARD
============================================================ */
export const getDashboardStats = () =>
  adminAxios.get("/admin/dashboard/");

/* ============================================================
   🧑 USERS
============================================================ */
export const getUsers = () => adminAxios.get("/admin/users/");

/* ============================================================
   🧭 CATEGORIES
============================================================ */
export const getCategories = () =>
  adminAxios.get("/admin/categories/");

export const createCategory = (data) =>
  adminAxios.post("/admin/categories/", data);

export const updateCategory = (id, data) =>
  adminAxios.put(`/admin/categories/${id}/`, data);

export const deleteCategory = (id) =>
  adminAxios.delete(`/admin/categories/${id}/`);

/* ============================================================
   🛒 PRODUCTS
============================================================ */
export const getProducts = () => adminAxios.get("/admin/products/");
export const getProductDetail = (id) => adminAxios.get(`/admin/products/${id}/`);
export const createProduct = (data) => adminAxios.post("/admin/products/", data);
export const updateProduct = (id, data) =>
  adminAxios.put(`/admin/products/${id}/`, data);
export const deleteProduct = (id) =>
  adminAxios.delete(`/admin/products/${id}/`);

/* ============================================================
   📦 ORDERS
============================================================ */
export const getOrders = () => adminAxios.get("/admin/orders/");
export const getOrderDetails = (no) =>
  adminAxios.get(`/admin/orders/${no}/`);
export const updateOrderStatus = (no, data) =>
  adminAxios.patch(`/admin/orders/${no}/status/`, data);

/* ============================================================
   💳 PAYMENTS
============================================================ */
export const getPayments = () => adminAxios.get("/admin/payments/");

/* ============================================================
   🏠 HOMEPAGE
============================================================ */
export const getHomepageContent = () => adminAxios.get("/admin/homepage/");
export const updateHomepageContent = (data) =>
  adminAxios.put("/admin/homepage/", data);

/* ============================================================
   🦶 FOOTER : BRAND
============================================================ */


/* ... (AUTH, DASHBOARD, USERS, CATEGORIES, PRODUCTS, ORDERS, PAYMENTS, HOMEPAGE same as abhi hain) */

/* ============================================================
   🦶 FOOTER : BRAND
============================================================ */
export const getFooterBrand = () =>
  adminAxios.get("/admin/footer/brand/");
export const updateFooterBrand = (data) =>
  adminAxios.put("/admin/footer/brand/", data);

/* ============================================================
   🦶 FOOTER : NEWSLETTER
============================================================ */
export const getNewsletterSettings = () =>
  adminAxios.get("/admin/footer/newsletter/");
export const updateNewsletterSettings = (data) =>
  adminAxios.put("/admin/footer/newsletter/", data);

/* ============================================================
   🦶 FOOTER : SOCIAL LINKS
============================================================ */
export const getSocialLinks = () =>
  adminAxios.get("/admin/footer/social/");

export const createSocialLink = (data) =>
  adminAxios.post("/admin/footer/social/", data);

export const updateSocialLink = (id, data) =>
  adminAxios.put(`/admin/footer/social/${id}/`, data);

export const deleteSocialLink = (id) =>
  adminAxios.delete(`/admin/footer/social/${id}/`);

/* ============================================================
   🦶 FOOTER : COLUMNS
============================================================ */
export const getFooterColumns = () =>
  adminAxios.get("/admin/footer/columns/");

export const createFooterColumn = (data) =>
  adminAxios.post("/admin/footer/columns/", data);

export const updateFooterColumn = (id, data) =>
  adminAxios.put(`/admin/footer/columns/${id}/`, data);

export const deleteFooterColumn = (id) =>
  adminAxios.delete(`/admin/footer/columns/${id}/`);

/* ============================================================
   🦶 FOOTER : LINKS (inside column)
============================================================ */
export const getFooterColumnLinks = (columnId) =>
  adminAxios.get(`/admin/footer/columns/${columnId}/links/`);

export const createFooterLink = (columnId, data) =>
  adminAxios.post(`/admin/footer/columns/${columnId}/links/`, data);

export const updateFooterLink = (id, data) =>
  adminAxios.put(`/admin/footer/links/${id}/`, data);

export const deleteFooterLink = (id) =>
  adminAxios.delete(`/admin/footer/links/${id}/`);

/* ============================================================
   🦶 FOOTER : PAYMENTS (baad me use karenge)
============================================================ */
export const getFooterPayments = () =>
  adminAxios.get("/admin/footer/payments/");

export const createFooterPayment = (data) =>
  adminAxios.post("/admin/footer/payments/", data);
