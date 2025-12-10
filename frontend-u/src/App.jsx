import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "./api/axiosClient";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";
import AddressPage from "./pages/AddressPage";
import WishlistPage from "./pages/WishlistPage";
import CategoryPage from "./components/CategoryPage";
import AllProductsPage from "./pages/AllProductsPage";
import TrackOrder from "./pages/TrackOrder";

// Footer Section
import FooterSection from "./components/home/FooterSection";
import TawkTo from "./components/TawkTo";

// Footer Pages
import AboutUs from "./pages/footer/AboutUs";
import ContactUs from "./pages/footer/ContactUs";
import OrdersReturns from "./pages/footer/OrdersReturns";
import ReturnRefund from "./pages/footer/ReturnRefund";

import PrivacyPolicy from "./pages/footer/PrivacyPolicy";
import TermsOfUse from "./pages/footer/TermsOfUse";
import ShippingPolicy from "./pages/footer/ShippingPolicy";
import SiteMap from "./pages/footer/SiteMap";

import PaymentMethods from "./pages/footer/PaymentMethods";

import VerifyOTP from "./pages/VerifyOTP";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// ⭐ SCROLL TO TOP COMPONENT
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  const [footerData, setFooterData] = useState(null);

  useEffect(() => {
    async function loadFooter() {
      try {
        const res = await axiosClient.get("/footer/");
        setFooterData(res.data);
      } catch (err) {
        console.error("Footer load failed", err);
      }
    }
    loadFooter();
  }, []);

  return (
    <BrowserRouter>

     <TawkTo />
      {/* ⭐ Scroll to Top */}
      <ScrollToTop />

      <Navbar />

      <Routes>
        {/* Main Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:slug" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Orders */}
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/order/:orderId" element={<OrderDetails />} />

        {/* User */}
        <Route path="/addresses" element={<AddressPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />

        {/* Products */}
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/all-products" element={<AllProductsPage />} />

        {/* Footer Pages */}
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/orders-returns" element={<OrdersReturns />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/returns" element={<ReturnRefund />} />

        <Route path="/privacy" element={<PrivacyPolicy />} />

        <Route path="/terms" element={<TermsOfUse />} />
        <Route path="/terms/" element={<TermsOfUse />} />

        <Route path="/shipping" element={<ShippingPolicy />} />
        <Route path="/sitemap" element={<SiteMap />} />

        <Route path="/payment-methods" element={<PaymentMethods />} />
      </Routes>

      {/* Footer */}
      <FooterSection footer={footerData || {}} />
    </BrowserRouter>
  );
}
