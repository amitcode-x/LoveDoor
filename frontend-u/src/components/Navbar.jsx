import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import { useWishlist } from "../context/WishlistContext";
import SearchBar from "./SearchBar";
import BottomNav from "./BottomNav";

import { FiMenu, FiUser, FiLogOut, FiSearch, FiHeart, FiX } from "react-icons/fi";
import { FaShoppingCart } from "react-icons/fa";
import SideDrawer from "./SideDrawer";
import CartDrawer from "../pages/CartDrawer";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { wishlistItems } = useWishlist();

  const [accountOpen, setAccountOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const toggleAccount = () => setAccountOpen((prev) => !prev);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
        setShowMobileSearch(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .hover-scale {
          transition: transform 0.2s ease;
        }

        .hover-scale:hover {
          transform: scale(1.1);
        }

        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .shadow-elegant {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .shadow-elegant:hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        .transition-all-smooth {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      <nav className="bg-white shadow-md sticky top-0 z-50">
        {/* =============== DESKTOP & TABLET VIEW =============== */}
        <div className="hidden md:block">
          <div className="max-w-7xl mx-auto px-12 py-3 flex items-center justify-between gap-4">
            
            {/* LEFT → Menu + Logo */}
            <div className="flex items-center gap-3">
              <button
                className="p-2 rounded-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all-smooth shadow-elegant"
                onClick={() => setDrawerOpen(true)}
              >
                <FiMenu className="w-6 h-6 text-gray-700" />
              </button>

              <Link 
                to="/" 
                className="text-2xl font-bold tracking-wide leading-tight transition-all-smooth hover:scale-105"
              >
                <span className="gradient-text">LoveDoor</span>
                <br />
                <span className="text-[10px] font-normal text-gray-500">
                  LoveDoor to Galaxy of Gift
                </span>
              </Link>
            </div>

            {/* CENTER → Search Bar */}
            <div className="flex-1 flex justify-center max-w-2xl px-8">
              <div className="w-full">
                <SearchBar />
              </div>
            </div>

            {/* RIGHT → Wishlist | Cart | Account */}
            <div className="flex items-center gap-5">
              
              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="flex items-center gap-2 text-gray-700 hover:text-pink-600 relative transition-all-smooth group px-3 py-2 rounded-lg hover:bg-pink-50"
              >
                <FiHeart className="w-5 h-5 hover-scale" />
                <span className="text-sm font-medium">Wishlist</span>
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse shadow-lg">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-all-smooth group px-3 py-2 rounded-lg hover:bg-purple-50"
              >
                <FaShoppingCart className="w-5 h-5 hover-scale" />
                <span className="text-sm font-medium">Cart</span>

                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs px-2 py-0.5 rounded-full animate-pulse shadow-lg">
                    {cart.length}
                  </span>
                )}
              </button>

              {/* Account Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleAccount}
                  className="flex items-center gap-2 border-2 border-gray-200 px-4 py-2 rounded-full hover:border-purple-400 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all-smooth shadow-elegant"
                >
                  <FiUser className="w-5 h-5 text-gray-700" />
                  <span className="text-sm font-semibold text-gray-800">
                    {user ? user.username : "Account"}
                  </span>
                </button>

                {accountOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-100 shadow-2xl rounded-xl p-4 text-sm text-gray-800 animate-fadeIn">
                    {user ? (
                      <>
                        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3 mb-3">
                          <p className="font-bold text-gray-800">Hello, {user.username}! 👋</p>
                        </div>

                        <div className="flex flex-col gap-2 mb-3">
                          <Link 
                            to="/profile" 
                            onClick={() => setAccountOpen(false)} 
                            className="hover:text-purple-600 transition-all-smooth px-2 py-1.5 rounded hover:bg-purple-50"
                          >
                            👤 Profile
                          </Link>
                          <Link 
                            to="/my-orders" 
                            onClick={() => setAccountOpen(false)} 
                            className="hover:text-purple-600 transition-all-smooth px-2 py-1.5 rounded hover:bg-purple-50"
                          >
                            📦 My Orders
                          </Link>
                          <Link 
                            to="/addresses" 
                            onClick={() => setAccountOpen(false)} 
                            className="hover:text-purple-600 transition-all-smooth px-2 py-1.5 rounded hover:bg-purple-50"
                          >
                            📍 Addresses
                          </Link>
                          <Link 
                            to="/shop" 
                            onClick={() => setAccountOpen(false)} 
                            className="hover:text-purple-600 transition-all-smooth px-2 py-1.5 rounded hover:bg-purple-50"
                          >
                            🛍️ Shop
                          </Link>
                          <Link 
                            to="/" 
                            onClick={() => setAccountOpen(false)} 
                            className="hover:text-purple-600 transition-all-smooth px-2 py-1.5 rounded hover:bg-purple-50"
                          >
                            🏠 Home
                          </Link>
                        </div>

                        <div className="border-t border-gray-200 my-2" />

                        <button
                          onClick={() => {
                            logout();
                            setAccountOpen(false);
                          }}
                          className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 w-full px-2 py-1.5 rounded transition-all-smooth font-medium"
                        >
                          <FiLogOut />
                          <span>Logout</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-3 mb-3">
                          <p className="font-bold text-gray-800">Welcome, Guest! 🎁</p>
                        </div>

                        <div className="flex flex-col gap-2 mb-3">
                          <Link 
                            to="/login" 
                            onClick={() => setAccountOpen(false)} 
                            className="hover:text-purple-600 transition-all-smooth px-2 py-1.5 rounded hover:bg-purple-50"
                          >
                            🔐 Login
                          </Link>
                          <Link 
                            to="/register" 
                            onClick={() => setAccountOpen(false)} 
                            className="hover:text-purple-600 transition-all-smooth px-2 py-1.5 rounded hover:bg-purple-50"
                          >
                            ✨ Register
                          </Link>
                          <Link 
                            to="/shop" 
                            onClick={() => setAccountOpen(false)} 
                            className="hover:text-purple-600 transition-all-smooth px-2 py-1.5 rounded hover:bg-purple-50"
                          >
                            🛍️ Shop
                          </Link>
                          <Link 
                            to="/" 
                            onClick={() => setAccountOpen(false)} 
                            className="hover:text-purple-600 transition-all-smooth px-2 py-1.5 rounded hover:bg-purple-50"
                          >
                            🏠 Home
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CATEGORY MENU - Desktop */}
          <BottomNav />
        </div>

        {/* =============== MOBILE VIEW =============== */}
        <div className="md:hidden">
          {/* TOP ROW - Always visible */}
          <div className="px-4 py-4 flex items-center justify-between bg-gradient-to-r from-white via-purple-50 to-pink-50">
            {/* LEFT - Menu + Logo */}
            <div className="flex items-center gap-3">
              <button
                className="p-2 rounded-lg hover:bg-white/80 transition-all-smooth shadow-elegant"
                onClick={() => setDrawerOpen(true)}
              >
                <FiMenu className="w-6 h-6 text-gray-700" />
              </button>

              <Link 
                to="/" 
                className="text-xl font-bold tracking-wide transition-all-smooth"
              >
                <span className="gradient-text">LoveDoor</span>
              </Link>
            </div>

            {/* RIGHT - Search Icon, Wishlist, Cart */}
            <div className="flex items-center gap-3">
              {/* Search Icon - Shows when scrolled */}
              {scrolled && !showMobileSearch && (
                <button
                  onClick={() => setShowMobileSearch(true)}
                  className="p-2 rounded-lg hover:bg-white/80 transition-all-smooth shadow-elegant"
                >
                  <FiSearch className="w-5 h-5 text-gray-700" />
                </button>
              )}

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative text-gray-700 hover:text-pink-600 transition-all-smooth p-2 rounded-lg hover:bg-white/80"
              >
                <FiHeart className="w-5 h-5 hover-scale" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs px-1.5 py-0.5 rounded-full animate-pulse">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative text-gray-700 hover:text-purple-600 transition-all-smooth p-2 rounded-lg hover:bg-white/80"
              >
                <FaShoppingCart className="w-5 h-5 hover-scale" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs px-1.5 py-0.5 rounded-full animate-pulse">
                    {cart.length}
                  </span>
                )}
              </button>

              {/* Account */}
              {/* <button
                onClick={toggleAccount}
                className="p-2 rounded-lg border-2 border-gray-200 hover:border-purple-400 hover:bg-white/80 transition-all-smooth shadow-elegant"
              >
                <FiUser className="w-5 h-5 text-gray-700" />
              </button> */}
            </div>
          </div>

          {/* SEARCH BAR - Below top row, hides on scroll */}
          {!scrolled && (
            <div className="px-4 pb-3 transition-all-smooth bg-gradient-to-r from-white via-purple-50 to-pink-50">
              <SearchBar />
            </div>
          )}

          {/* MOBILE SEARCH OVERLAY - Shows when search icon clicked */}
          {showMobileSearch && (
            <div className="px-4 pb-3 bg-white border-t-2 border-purple-200 animate-slideDown shadow-lg">
              <div className="flex items-center gap-2 pt-3">
                <div className="flex-1">
                  <SearchBar />
                </div>
                <button
                  onClick={() => setShowMobileSearch(false)}
                  className="p-2 rounded-lg hover:bg-red-50 transition-all-smooth text-red-500"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Account Dropdown - Mobile */}
          {/* {accountOpen && (
            <div className="absolute right-4 top-20 w-64 bg-white border border-gray-100 shadow-2xl rounded-xl p-4 z-50 animate-fadeIn">
              {user ? (
                <>
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3 mb-3">
                    <p className="font-bold text-gray-800">Hello, {user.username}! 👋</p>
                  </div>
                  <div className="flex flex-col gap-2 mb-3">
                    <Link to="/profile" onClick={() => setAccountOpen(false)} className="hover:text-purple-600 px-2 py-1.5 rounded hover:bg-purple-50 transition-all-smooth">
                      👤 Profile
                    </Link>
                    <Link to="/my-orders" onClick={() => setAccountOpen(false)} className="hover:text-purple-600 px-2 py-1.5 rounded hover:bg-purple-50 transition-all-smooth">
                      📦 My Orders
                    </Link>
                    <Link to="/addresses" onClick={() => setAccountOpen(false)} className="hover:text-purple-600 px-2 py-1.5 rounded hover:bg-purple-50 transition-all-smooth">
                      📍 Addresses
                    </Link>
                    <Link to="/shop" onClick={() => setAccountOpen(false)} className="hover:text-purple-600 px-2 py-1.5 rounded hover:bg-purple-50 transition-all-smooth">
                      🛍️ Shop
                    </Link>
                  </div>
                  <div className="border-t border-gray-200 my-2" />
                  <button
                    onClick={() => {
                      logout();
                      setAccountOpen(false);
                    }}
                    className="flex items-center gap-2 text-red-600 hover:bg-red-50 w-full px-2 py-1.5 rounded transition-all-smooth font-medium"
                  >
                    <FiLogOut />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-3 mb-3">
                    <p className="font-bold text-gray-800">Welcome, Guest! 🎁</p>
                  </div>
                  <div className="flex flex-col gap-2 mb-3">
                    <Link to="/login" onClick={() => setAccountOpen(false)} className="hover:text-purple-600 px-2 py-1.5 rounded hover:bg-purple-50 transition-all-smooth">
                      🔐 Login
                    </Link>
                    <Link to="/register" onClick={() => setAccountOpen(false)} className="hover:text-purple-600 px-2 py-1.5 rounded hover:bg-purple-50 transition-all-smooth">
                      ✨ Register
                    </Link>
                    <Link to="/shop" onClick={() => setAccountOpen(false)} className="hover:text-purple-600 px-2 py-1.5 rounded hover:bg-purple-50 transition-all-smooth">
                      🛍️ Shop
                    </Link>
                  </div>
                </>
              )}
            </div>
          )} */}
        </div>

        {/* LEFT MENU DRAWER */}
        <SideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

        {/* RIGHT CART DRAWER */}
        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      </nav>
    </>
  );
}