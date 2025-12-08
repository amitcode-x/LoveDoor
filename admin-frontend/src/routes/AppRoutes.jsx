// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";

import AdminLayout from "../components/Layout/AdminLayout";

import Dashboard from "../pages/dashboard/Dashboard";

// Orders
import OrderDetail from "../pages/orders/OrderDetail";
import OrderList from "../pages/orders/OrderList";
import OrderStatusUpdate from "../pages/orders/OrderStatusUpdate";

// Products
import ProductList from "../pages/products/ProductList";
import ProductCreate from "../pages/products/ProductCreate";
import ProductEdit from "../pages/products/ProductEdit";
import ProductView from "../pages/products/ProductView";

// Categories
import CategoryList from "../pages/categories/CategoryList";
import CategoryForm from "../pages/categories/CategoryForm";

// Users & Payments
import UserList from "../pages/users/UserList";
import UserDetail from "../pages/users/UserDetail";
import PaymentList from "../pages/payments/PaymentList";
import PaymentDetail from "../pages/payments/PaymentDetail";

// Homepage & Footer
import ManageHomepage from "../pages/homepage/ManageHomepage";

import StaticHeroEdit from "../pages/homepage/StaticHeroEdit";
import HeroSlideCreate from "../pages/homepage/HeroSlideCreate";
import HeroSlidesList from "../pages/homepage/HeroSlidesList";
import HeroSlideEdit from "../pages/homepage/HeroSlideEdit";

// ⭐ NEW: Featured Offers
import FeaturedOfferList from "../pages/homepage/FeaturedOfferList";
import FeaturedOfferCreate from "../pages/homepage/FeaturedOfferCreate";
import FeaturedOfferEdit from "../pages/homepage/FeaturedOfferEdit";

// secondary hero

import SecondaryHeroEdit from "../pages/homepage/SecondaryHeroEdit";

// gift offer
import GiftOfferEdit from "../pages/homepage/GiftOfferEdit";

// service features

import ServiceFeaturesList from "../pages/homepage/ServiceFeaturesList";
import ServiceFeatureCreate from "../pages/homepage/ServiceFeatureCreate";
import ServiceFeatureEdit from "../pages/homepage/ServiceFeatureEdit";




import ManageFooter from "../pages/footer/ManageFooter";
import ManageNewsletter from "../pages/footer/ManageNewsletter";
import ManageSocialLinks from "../pages/footer/ManageSocialLinks";
import ManageFooterColumns from "../pages/footer/ManageFooterColumns";
import ManageFooterPayments from "../pages/footer/ManageFooterPayments";
import ManageFooterAbout from "../pages/footer/ManageFooterAbout";
import ManageContactPage from "../pages/footer/ManageContactPage";
import ManagePrivacyPolicy from "../pages/footer/ManagePrivacyPolicy";
import ManageTermsOfUse from "../pages/footer/ManageTermsOfUse";
import ManageShippingPolicy from "../pages/footer/ManageShippingPolicy";
import ManageReturnRefund from "../pages/footer/ManageReturnRefund";
import BottomNavForm from "../pages/categories/BottomNavForm";
import BottomNavList from "../pages/categories/BottomNavList";

// Auth
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
        <Route path="orders/:orderNumber" element={<OrderDetail />} />
        <Route
          path="orders/:orderNumber/status"
          element={<OrderStatusUpdate />}
        />
        {/* Products */}
        <Route path="products" element={<ProductList />} />
        <Route path="products/create" element={<ProductCreate />} />
        <Route path="products/:id/edit" element={<ProductEdit />} />
        <Route path="products/:id/view" element={<ProductView />} />
        {/* Users */}
        <Route path="users" element={<UserList />} />
        <Route path="users/:id" element={<UserDetail />} />
        {/* Payments */}
        <Route path="payments" element={<PaymentList />} />
        <Route path="payments/:id" element={<PaymentDetail />} /> // ⭐ ADD THIS
        {/* Homepage */}
        <Route path="homepage" element={<ManageHomepage />} />
        <Route path="homepage/static-hero" element={<StaticHeroEdit />} />
        <Route
          path="/admin/homepage/hero-slides"
          element={<HeroSlidesList />}
        />
        <Route
          path="/admin/homepage/hero-slides/create"
          element={<HeroSlideCreate />}
        />
        <Route
          path="/admin/homepage/hero-slides/:id/edit"
          element={<HeroSlideEdit />}
        />

            {/* ⭐ Featured Offers */}
        <Route
          path="homepage/featured-offers"
          element={<FeaturedOfferList />}
        />
        <Route
          path="homepage/featured-offers/create"
          element={<FeaturedOfferCreate />}
        />
        <Route
          path="homepage/featured-offers/:id/edit"
          element={<FeaturedOfferEdit />}
        />

        {/* Secondary Hero */}

        <Route path="homepage/secondary-hero" element={<SecondaryHeroEdit />} />

        {/* gift offer */}

        <Route path="homepage/gift-offer" element={<GiftOfferEdit />} />

        {/* service features */}

 {/* ⭐ FINAL FIXED ROUTES FOR SERVICE FEATURES */}
        <Route path="admin/homepage/service-features" element={<ServiceFeaturesList />} />
        <Route path="admin/homepage/service-features/create" element={<ServiceFeatureCreate />} />
        <Route path="admin/homepage/service-features/:id/edit" element={<ServiceFeatureEdit />} />




        {/* Footer sections */}
        <Route path="footer" element={<ManageFooter />} />
        <Route path="newsletter" element={<ManageNewsletter />} />
        <Route path="footer/social" element={<ManageSocialLinks />} />
        <Route path="footer/columns" element={<ManageFooterColumns />} />
        <Route path="footer/payments" element={<ManageFooterPayments />} />
        <Route path="footer/about" element={<ManageFooterAbout />} />
        <Route path="footer/contact" element={<ManageContactPage />} />
        <Route path="footer/privacy-policy" element={<ManagePrivacyPolicy />} />
        <Route path="footer/terms" element={<ManageTermsOfUse />} />
        <Route
          path="footer/shipping-policy"
          element={<ManageShippingPolicy />}
        />
        <Route path="footer/return-refund" element={<ManageReturnRefund />} />
        {/* Categories */}
        <Route path="categories" element={<CategoryList />} />
        <Route path="categories/create" element={<CategoryForm />} />
        <Route path="categories/:id" element={<CategoryForm />} />
        <Route path="bottom-nav" element={<BottomNavList />} />
        <Route path="bottom-nav/create" element={<BottomNavForm />} />
        <Route path="bottom-nav/:id" element={<BottomNavForm />} />
      </Route>
    </Routes>
  );
}
