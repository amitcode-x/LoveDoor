import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiHeart,
  FiSearch,
  FiSettings,
  FiShare2,
  FiStar,
  FiHome,
  FiShoppingBag,
  FiUser,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";

export default function SideDrawer({ open, onClose }) {
  const { user } = useAuth();
  const { wishlistItems } = useWishlist();
  const navigate = useNavigate();

  // Same categories idea as BottomNav + tumhare text ke hisaab se
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
    // Agar /settings route hai to use karo, warna simple alert
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
    <>
      {/* Dark overlay */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}

      {/* LEFT Drawer */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: open ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 220, damping: 26 }}
        className="fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-xl p-5 overflow-y-auto"
      >
        {/* Header */}
        <div className="mb-5">
          <p className="text-xs text-gray-500 mb-1">Hello,</p>
          <h2 className="text-lg font-bold">
            {user ? user.username : "Sign in"}
          </h2>

          {user ? (
            <button
              onClick={() => {
                navigate("/profile");
                onClose();
              }}
              className="mt-2 flex items-center gap-2 text-xs text-blue-600 hover:underline"
            >
              <FiUser className="w-4 h-4" />
              View Profile
            </button>
          ) : (
            <div className="mt-2 flex gap-2 text-xs">
              <Link
                to="/login"
                onClick={onClose}
                className="px-3 py-1 border rounded-full hover:bg-gray-50"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={onClose}
                className="px-3 py-1 border rounded-full hover:bg-gray-50"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        <hr className="mb-4" />

        {/* Main menu items */}
        <div className="space-y-3 text-sm text-gray-800">
          <button
            onClick={handleHome}
            className="w-full flex items-center gap-3 text-left hover:text-black"
          >
            <FiHome className="w-4 h-4" />
            Home
          </button>

          <button
            onClick={handleShopAll}
            className="w-full flex items-center gap-3 text-left hover:text-black"
          >
            <FiShoppingBag className="w-4 h-4" />
            Shop All
          </button>

          <button
            onClick={handleWishlistClick}
            className="w-full flex items-center gap-3 text-left hover:text-black"
          >
            <FiHeart className="w-4 h-4" />
            <span>Wishlist</span>
            {wishlistItems?.length > 0 && (
              <span className="ml-auto text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                {wishlistItems.length}
              </span>
            )}
          </button>

          <button
            onClick={handleTrackOrder}
            className="w-full flex items-center gap-3 text-left hover:text-black"
          >
            <FiSearch className="w-4 h-4" />
            Track Order
          </button>
        </div>

        {/* Categories */}
        <div className="mt-5">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
            Shop by Category
          </p>

          <button
            onClick={handleShopAll}
            className="text-xs mb-2 text-blue-600 hover:underline"
          >
            See All
          </button>

          <div className="flex flex-col gap-2 text-sm">
            {categories.map((c) => (
              <button
                key={c.path}
                onClick={() => {
                  navigate(c.path);
                  onClose();
                }}
                className="text-left text-gray-700 hover:text-red-500"
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom actions */}
        <hr className="my-4" />

        <div className="space-y-3 text-sm text-gray-800">
          <button
            onClick={handleClearCache}
            className="w-full flex items-center gap-3 text-left hover:text-black"
          >
            <FiSettings className="w-4 h-4" />
            Clear Cache
          </button>

          <button
            onClick={handleRate}
            className="w-full flex items-center gap-3 text-left hover:text-black"
          >
            <FiStar className="w-4 h-4" />
            Rate App
          </button>

          <button
            onClick={handleShare}
            className="w-full flex items-center gap-3 text-left hover:text-black"
          >
            <FiShare2 className="w-4 h-4" />
            Share
          </button>

          <button
            onClick={handleSettings}
            className="w-full flex items-center gap-3 text-left hover:text-black"
          >
            <FiSettings className="w-4 h-4" />
            Settings
          </button>
        </div>
      </motion.div>
    </>
  );
}
