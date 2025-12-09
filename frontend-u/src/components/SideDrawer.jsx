import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHeart,
  FiSearch,
  FiSettings,
  FiShare2,
  FiStar,
  FiHome,
  FiShoppingBag,
  FiUser,
  FiX,
  FiMenu
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";

export default function SideDrawer({ open, onClose }) {
  const { user } = useAuth();
  const { wishlistItems } = useWishlist();
  const navigate = useNavigate();

  const categories = [
    { label: "Home & Garden", path: "/category/home-decor" },
    { label: "Fashion", path: "/category/fashion" },
    { label: "Jewelry & Accessories", path: "/category/jewelry-accessories" },
    { label: "Gifts", path: "/category/gifts" },
    { label: "Coffee Mugs", path: "/category/coffee-mugs" },
    { label: "Gadgets", path: "/category/gadgets" },
    { label: "Lamps and Lightings", path: "/category/lamps" },
  ];

  const handleClearCache = () => {
    localStorage.clear();
    sessionStorage.clear();
    onClose();
    window.location.reload();
  };

  const handleRate = () => {
    onClose();
    alert("Rate App feature coming soon 🙂");
  };

  const handleShare = () => {
    onClose();
    const url = window.location.origin;
    if (navigator.share) {
      navigator
        .share({
          title: "LoveDoor - Galaxy of Gifts",
          text: "Check out this awesome gift store!",
          url,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(url).catch(() => {});
      alert("Link copied! Share it with your friends 💖");
    }
  };

  const handleSettings = () => {
    try {
      navigate("/settings");
    } catch {
      alert("Settings page coming soon!");
    }
    onClose();
  };

  const handleTrackOrder = () => {
    navigate("/track-order");
    onClose();
  };

  const handleWishlistClick = () => {
    navigate("/wishlist");
    onClose();
  };

  const handleShopAll = () => {
    navigate("/shop");
    onClose();
  };

  const handleHome = () => {
    navigate("/");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <style>{`
            /* Hide scrollbar */
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .hide-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }

            /* 3D Card Effect */
            .card-3d {
              box-shadow: 
                0 1px 2px rgba(0,0,0,0.07),
                0 2px 4px rgba(0,0,0,0.07),
                0 4px 8px rgba(0,0,0,0.07),
                0 8px 16px rgba(0,0,0,0.07);
              transform: translateZ(0);
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .card-3d:hover {
              transform: translateY(-4px) translateZ(0);
              box-shadow: 
                0 2px 4px rgba(0,0,0,0.1),
                0 4px 8px rgba(0,0,0,0.1),
                0 8px 16px rgba(0,0,0,0.1),
                0 16px 32px rgba(0,0,0,0.15);
            }

            .card-3d:active {
              transform: translateY(-1px) translateZ(0);
              box-shadow: 
                0 1px 2px rgba(0,0,0,0.07),
                0 2px 4px rgba(0,0,0,0.07);
            }

            /* Icon 3D Effect */
            .icon-3d {
              box-shadow: 
                inset 0 -2px 4px rgba(0,0,0,0.1),
                inset 0 2px 4px rgba(255,255,255,0.8),
                0 4px 8px rgba(0,0,0,0.15);
            }

            /* Button 3D Effect */
            .btn-3d {
              box-shadow: 
                0 4px 6px rgba(0,0,0,0.1),
                0 1px 3px rgba(0,0,0,0.08),
                inset 0 -2px 0 rgba(0,0,0,0.2);
              transition: all 0.2s ease;
            }

            .btn-3d:hover {
              transform: translateY(-2px);
              box-shadow: 
                0 6px 12px rgba(0,0,0,0.15),
                0 2px 4px rgba(0,0,0,0.1),
                inset 0 -2px 0 rgba(0,0,0,0.2);
            }

            .btn-3d:active {
              transform: translateY(0);
              box-shadow: 
                0 2px 4px rgba(0,0,0,0.1),
                inset 0 2px 4px rgba(0,0,0,0.2);
            }

            /* Embossed Text Effect */
            .text-embossed {
              text-shadow: 0 1px 2px rgba(255,255,255,0.5), 0 -1px 2px rgba(0,0,0,0.2);
            }
          `}</style>

          {/* Backdrop Overlay with Blur */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[998]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* LEFT DRAWER */}
          <motion.div
            className="fixed top-0 left-0 w-full sm:w-80 h-full bg-gradient-to-br from-gray-50 to-gray-100 shadow-2xl z-[999] flex flex-col"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            style={{
              boxShadow: '0 0 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.5)'
            }}
          >
            {/* HEADER - 3D Style */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 flex items-center justify-between text-white relative"
              style={{
                boxShadow: '0 4px 12px rgba(0,0,0,0.3), inset 0 -1px 0 rgba(255,255,255,0.1)'
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center icon-3d">
                  <FiMenu className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Hello,</p>
                  <h2 className="text-xl font-bold text-embossed">
                    {user ? user.username : "Sign in"}
                  </h2>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-110"
                style={{
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Login/Register OR Profile Button */}
            {user ? (
              <div className="px-5 pt-4 border-b pb-4">
                <button
                  onClick={() => {
                    navigate("/profile");
                    onClose();
                  }}
                  className="w-full py-3 bg-gradient-to-br from-gray-800 to-gray-900 text-white font-semibold rounded-lg btn-3d flex items-center justify-center gap-2"
                >
                  <FiUser className="w-4 h-4" />
                  View Profile
                </button>
              </div>
            ) : (
              <div className="px-5 pt-4 flex gap-2 border-b pb-4">
                <Link
                  to="/login"
                  onClick={onClose}
                  className="flex-1 py-3 bg-gradient-to-br from-gray-800 to-gray-900 text-white font-semibold rounded-lg btn-3d text-center"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={onClose}
                  className="flex-1 py-3 bg-white text-gray-700 font-semibold rounded-lg text-center card-3d"
                >
                  Register
                </Link>
              </div>
            )}

            {/* MAIN CONTENT - Scrollable WITHOUT scrollbar */}
            <div className="flex-1 overflow-y-auto hide-scrollbar p-5 space-y-3">
              {/* Main menu items */}
              <div className="space-y-2">
                <motion.button
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  onClick={handleHome}
                  className="w-full bg-white rounded-xl p-3.5 card-3d"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center icon-3d">
                      <FiHome className="w-5 h-5 text-gray-700" />
                    </div>
                    <span className="font-semibold text-gray-800 text-left">Home</span>
                  </div>
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  onClick={handleShopAll}
                  className="w-full bg-white rounded-xl p-3.5 card-3d"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center icon-3d">
                      <FiShoppingBag className="w-5 h-5 text-gray-700" />
                    </div>
                    <span className="font-semibold text-gray-800 text-left">Shop All</span>
                  </div>
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  onClick={handleWishlistClick}
                  className="w-full bg-white rounded-xl p-3.5 card-3d"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center icon-3d">
                      <FiHeart className="w-5 h-5 text-red-600" />
                    </div>
                    <span className="font-semibold text-gray-800 text-left flex-1">Wishlist</span>
                    {wishlistItems?.length > 0 && (
                      <span className="px-2.5 py-1 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold rounded-full"
                        style={{
                          boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4), inset 0 -1px 2px rgba(0,0,0,0.2)'
                        }}
                      >
                        {wishlistItems.length}
                      </span>
                    )}
                  </div>
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                  onClick={handleTrackOrder}
                  className="w-full bg-white rounded-xl p-3.5 card-3d"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center icon-3d">
                      <FiSearch className="w-5 h-5 text-gray-700" />
                    </div>
                    <span className="font-semibold text-gray-800 text-left">Track Order</span>
                  </div>
                </motion.button>
              </div>

              {/* Categories Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl p-4 card-3d"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Shop by Category
                  </p>
                  <button
                    onClick={handleShopAll}
                    className="text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    See All →
                  </button>
                </div>

                <div className="space-y-1">
                  {categories.map((c, index) => (
                    <button
                      key={c.path}
                      onClick={() => {
                        navigate(c.path);
                        onClose();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium transition-all duration-300 hover:translate-x-1"
                      style={{
                        boxShadow: '0 0 0 rgba(0,0,0,0)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 0 0 rgba(0,0,0,0)'}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Bottom Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="bg-white rounded-xl p-4 card-3d"
              >
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">
                  More Options
                </p>

                <div className="space-y-1">
                  <button
                    onClick={handleClearCache}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium transition-all duration-300"
                  >
                    <FiSettings className="w-4 h-4" />
                    Clear Cache
                  </button>

                  <button
                    onClick={handleRate}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium transition-all duration-300"
                  >
                    <FiStar className="w-4 h-4" />
                    Rate App
                  </button>

                  <button
                    onClick={handleShare}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium transition-all duration-300"
                  >
                    <FiShare2 className="w-4 h-4" />
                    Share
                  </button>

                  <button
                    onClick={handleSettings}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium transition-all duration-300"
                  >
                    <FiSettings className="w-4 h-4" />
                    Settings
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}