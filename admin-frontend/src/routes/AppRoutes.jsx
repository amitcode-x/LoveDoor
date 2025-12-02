// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";

import AdminLayout from "../components/Layout/AdminLayout";

import Dashboard from "../pages/dashboard/Dashboard";
import OrderList from "../pages/orders/OrderList";
import OrderDetail from "../pages/orders/OrderDetail";

import ProductList from "../pages/products/ProductList";
import ProductCreate from "../pages/products/ProductCreate";
import ProductEdit from "../pages/products/ProductEdit";

import CategoryList from "../pages/categories/CategoryList";
import CategoryCreateEdit from "../pages/categories/CategoryCreateEdit";

import UserList from "../pages/users/UserList";
import PaymentList from "../pages/payments/PaymentList";

import ManageHomepage from "../pages/homepage/ManageHomepage";
import ManageFooter from "../pages/footer/ManageFooter";
import ManageNewsletter from "../pages/footer/ManageNewsletter";
import ManageSocialLinks from "../pages/footer/ManageSocialLinks";
import ManageFooterColumns from "../pages/footer/ManageFooterColumns";
import ManageFooterPayments from "../pages/footer/ManageFooterPayments";

import ManageFooterAbout from "../pages/footer/ManageFooterAbout";
import ManageContactPage from "../pages/footer/ManageContactPage";
import ManagePrivacyPolicy from "../pages/footer/ManagePrivacyPolicy";
import ManageTermsOfUse from "../pages/footer/ManageTermsOfUse";
// AppRouter.jsx
import ManageShippingPolicy from "../pages/footer/ManageShippingPolicy";

import ManageReturnRefund from "../pages/footer/ManageReturnRefund";












import AdminLogin from "../pages/auth/AdminLogin";
import ProtectedRoute from "../auth/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Login */}
      <Route path="/login" element={<AdminLogin />} />

      {/* Admin Area */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard */}
        <Route index element={<Dashboard />} />

        {/* Orders */}
        <Route path="orders" element={<OrderList />} />
        <Route path="orders/:order_number" element={<OrderDetail />} />

        {/* Products */}
        <Route path="products" element={<ProductList />} />
        <Route path="products/create" element={<ProductCreate />} />
        <Route path="products/:id/edit" element={<ProductEdit />} />

        {/* Categories */}
        <Route path="categories" element={<CategoryList />} />
        <Route path="categories/create" element={<CategoryCreateEdit />} />
        <Route path="categories/:id/edit" element={<CategoryCreateEdit />} />

        {/* Users */}
        <Route path="users" element={<UserList />} />

        {/* Payments */}
        <Route path="payments" element={<PaymentList />} />

        {/* Homepage */}
        <Route path="homepage" element={<ManageHomepage />} />

        {/* Footer sections */}
        <Route path="footer" element={<ManageFooter />} />
        <Route path="newsletter" element={<ManageNewsletter />} />
        <Route path="footer/social" element={<ManageSocialLinks />} />
        <Route path="footer/columns" element={<ManageFooterColumns />} />
        <Route path="footer/payments" element={<ManageFooterPayments />} />
        <Route path="footer/about" element={<ManageFooterAbout />} />
        <Route path="/footer/contact" element={<ManageContactPage />} />
        <Route path="/footer/privacy-policy" element={<ManagePrivacyPolicy />} />
        <Route path="/footer/terms" element={<ManageTermsOfUse />} />   {/* 👈 NEW */}
        <Route path="/footer/shipping-policy" element={<ManageShippingPolicy />} />
        <Route path="/footer/return-refund" element={<ManageReturnRefund />} />

       







      </Route>
    </Routes>
  );
}
