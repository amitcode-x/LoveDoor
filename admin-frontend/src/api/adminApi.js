
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

// Single user detail
export const getUserDetail = (id) =>
  adminAxios.get(`/admin/users/${id}/`);

// Block user
export const blockUser = (id) =>
  adminAxios.patch(`/admin/users/${id}/block/`);

// Unblock user
export const unblockUser = (id) =>
  adminAxios.patch(`/admin/users/${id}/unblock/`);

// Delete user
export const deleteUser = (id) =>
  adminAxios.delete(`/admin/users/${id}/`);

/* ============================================================
   🧭 CATEGORIES
============================================================ */
/* ============================================================
   🧭 CATEGORIES (ADMIN)
============================================================ */
export const getCategories = () =>
  adminAxios.get("/admin/categories/");

export const getCategoryDetail = (id) =>
  adminAxios.get(`/admin/categories/${id}/`);

export const createCategory = (data) =>
  adminAxios.post("/admin/categories/", data);

export const updateCategory = (id, data) =>
  adminAxios.put(`/admin/categories/${id}/`, data);

export const deleteCategory = (id) =>
  adminAxios.delete(`/admin/categories/${id}/`);




// =================== BOTTOM NAV CATEGORY ===================
export const getBottomNavCategories = () =>
  adminAxios.get("/admin/homepage/bottom-nav/");

export const getBottomNavCategoryDetail = (id) =>
  adminAxios.get(`/admin/homepage/bottom-nav/${id}/`);

export const createBottomNavCategory = (data) =>
  adminAxios.post("/admin/homepage/bottom-nav/", data);

export const updateBottomNavCategory = (id, data) =>
  adminAxios.put(`/admin/homepage/bottom-nav/${id}/`, data);

export const deleteBottomNavCategory = (id) =>
  adminAxios.delete(`/admin/homepage/bottom-nav/${id}/`);



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

// =============== ORDERS (ADMIN PANEL) ===============
// ===================== ORDERS (ADMIN) =====================

// ===================== ORDERS (ADMIN) =====================

// List orders (with optional ?status=)
export function getOrders(status = "") {
  const url = status ? `/admin/orders/?status=${status}` : `/admin/orders/`;
  return adminAxios.get(url);
}

// Get order details using order_number
export function getOrderDetails(orderNumber) {
  return adminAxios.get(`/admin/orders/${orderNumber}/`);
}

// Update order status
export function updateOrderStatus(orderNumber, data) {
  return adminAxios.patch(`/admin/orders/${orderNumber}/status/`, data);
}

// ✅ NEW: Update single order item quantity
export function updateOrderItem(orderNumber, itemId, quantity) {
  return adminAxios.patch(
    `/admin/orders/${orderNumber}/items/${itemId}/`,
    { quantity }
  );
}

// ✅ NEW: Delete single order item
export function deleteOrderItem(orderNumber, itemId) {
  return adminAxios.delete(`/admin/orders/${orderNumber}/items/${itemId}/`);
}



/* ============================================================
   💳 PAYMENTS
============================================================ */
export const getPayments = () => adminAxios.get("/admin/payments/");

export const getPaymentDetail = (id) =>
  adminAxios.get(`/admin/payments/${id}/`);

export const refundPayment = (id) =>
  adminAxios.post(`/payments/refund/${id}/`);



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

export const updateFooterPayment = (id, data) =>
  adminAxios.put(`/admin/footer/payments/${id}/`, data);

export const deleteFooterPayment = (id) =>
  adminAxios.delete(`/admin/footer/payments/${id}/`);


/* ============================================================
   🦶 FOOTER : ABOUT PAGE
============================================================ */
export const getFooterAboutPage = () =>
  adminAxios.get("/admin/footer/about-page/");

export const updateFooterAboutPage = (data) =>
  adminAxios.put("/admin/footer/about-page/", data);

/* ============================================================
   🦶 FOOTER : contact
============================================================ */


export const getContactPage = () =>
  adminAxios.get("/admin/footer/contact-page/");

export const updateContactPage = (data) =>
  adminAxios.put("/admin/footer/contact-page/", data);

/* ============================================================
   🦶 FOOTER : Privacy-policy
============================================================ */

export const getPrivacyPolicy = () =>
  adminAxios.get("/admin/footer/privacy-policy/");

export const updatePrivacyPolicy = (data) =>
  adminAxios.put("/admin/footer/privacy-policy/", data);

/* ============================================================
   📜 FOOTER : TERMS OF USE
============================================================ */
export const getTermsOfUse = () =>
  adminAxios.get("/admin/footer/terms-of-use/");

export const updateTermsOfUse = (data) =>
  adminAxios.put("/admin/footer/terms-of-use/", data);


export const getShippingPolicy = () =>
  adminAxios.get("/admin/footer/shipping-policy/");

export const updateShippingPolicy = (data) =>
  adminAxios.put("/admin/footer/shipping-policy/", data);




// ==========================
// RETURN & REFUND PAGE
// ==========================
export const getReturnRefund = () =>
  adminAxios.get("/admin/footer/return-refund/");

export const updateReturnRefund = (data) =>
  adminAxios.put("/admin/footer/return-refund/", data);
