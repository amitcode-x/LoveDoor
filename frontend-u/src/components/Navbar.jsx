import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import { useWishlist } from "../context/WishlistContext";
import SearchBar from "./SearchBar";
import BottomNav from "./BottomNav";

import { FiMenu, FiUser, FiLogOut, FiSearch, FiHeart } from "react-icons/fi";
import { FaShoppingCart } from "react-icons/fa";
import SideDrawer from "./SideDrawer";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { wishlistItems } = useWishlist();

  const [accountOpen, setAccountOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false); // ⭐ NEW

  const toggleAccount = () => setAccountOpen((prev) => !prev);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      {/* =============== ROW 1: TOP BAR =============== */}
      <div className="max-w-7xl mx-auto px-2 md:px-6 py-6 flex items-center justify-between gap-4">
        {/* LEFT → Menu + Logo */}
        <div className="flex items-center gap-3">
          <button
            className="p-2 rounded hover:bg-gray-100"
            onClick={() => setDrawerOpen(true)} // ⭐ open drawer
          >
            <FiMenu className="w-6 h-6" />
          </button>

          <Link to="/" className="text-2xl font-bold tracking-wide leading-tight">
            LoveDoor <br />
            <span style={{ fontSize: "10px" }}>LoveDoor to Galaxy of Gift</span>
          </Link>
        </div>

        {/* CENTER → Search Bar */}
        <div className="flex-1 hidden md:flex justify-center">
          <div className="w-full max-w-lg">
            <SearchBar />
          </div>
        </div>

        {/* RIGHT → Wishlist | Cart | Account */}
        <div className="flex items-center gap-6 ml-auto">
          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="hidden sm:flex items-center gap-1 text-gray-700 hover:text-black relative"
          >
            <FiHeart className="w-5 h-5" />
            <span className="text-sm">Wishlist</span>
            {wishlistItems.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative flex items-center gap-1 text-gray-700 hover:text-black"
          >
            <FaShoppingCart className="w-5 h-5" />
            <span className="hidden sm:inline text-sm">Cart</span>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-black text-white text-xs px-2 py-0.5 rounded-full">
                {cart.length}
              </span>
            )}
          </Link>

          {/* Account */}
          <div className="relative">
            <button
              onClick={toggleAccount}
              className="flex items-center gap-2 border px-3 py-1.5 rounded-full hover:bg-gray-50"
            >
              <FiUser className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">
                {user ? user.username : "Account"}
              </span>
            </button>

            {accountOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border shadow-lg rounded-md p-3 text-sm text-gray-800">
                {user ? (
                  <>
                    <p className="font-semibold mb-2">
                      Hello, {user.username}
                    </p>

                    <div className="border-t my-2" />

                    <div className="flex flex-col gap-2 mb-2">
                      <Link to="/profile" onClick={() => setAccountOpen(false)}>
                        Profile
                      </Link>
                      <Link to="/my-orders" onClick={() => setAccountOpen(false)}>
                        My Orders
                      </Link>
                      <Link to="/addresses" onClick={() => setAccountOpen(false)}>
                        Addresses
                      </Link>
                      <Link to="/shop" onClick={() => setAccountOpen(false)}>
                        Shop
                      </Link>
                      <Link to="/" onClick={() => setAccountOpen(false)}>
                        Home
                      </Link>
                    </div>

                    <div className="border-t my-2" />

                    <button
                      onClick={() => {
                        logout();
                        setAccountOpen(false);
                      }}
                      className="flex items-center gap-2 text-red-600 hover:text-red-700 w-full"
                    >
                      <FiLogOut />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <p className="font-semibold mb-2">Welcome, Guest</p>

                    <div className="border-t my-2" />

                    <div className="flex flex-col gap-2 mb-2">
                      <Link to="/login" onClick={() => setAccountOpen(false)}>
                        Login
                      </Link>
                      <Link to="/register" onClick={() => setAccountOpen(false)}>
                        Register
                      </Link>
                      <Link to="/shop" onClick={() => setAccountOpen(false)}>
                        Shop
                      </Link>
                      <Link to="/" onClick={() => setAccountOpen(false)}>
                        Home
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =============== ROW 2: CATEGORY MENU (INSIDE NAVBAR) =============== */}
      <BottomNav />

      {/* MOBILE SEARCH BELOW */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <SearchBar />
        </div>
      </div>

      {/* ⭐ LEFT SIDE DRAWER (Menu) */}
      <SideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </nav>
  );
}
