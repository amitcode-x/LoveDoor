import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import {
  UserCircle,
  Mail,
  Phone,
  LogOut,
  MapPin,
  Package,
  Edit,
  Heart,
  ShoppingCart,
  Home,
  Check,
  X,
  Camera,
  Truck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext"; // Import wishlist context

export default function Profile() {
  const navigate = useNavigate();
 const { wishlistItems = [] } = useWishlist();
 // Get real wishlist
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [ordersCount, setOrdersCount] = useState(0);

  useEffect(() => {
    loadProfile();
    loadOrdersCount();
  }, []);

  const loadProfile = async () => {
    const res = await axiosClient.get("/auth/me/");
    setProfile(res.data);
    setLoading(false);
  };

  const loadOrdersCount = async () => {
    try {
      const res = await axiosClient.get("/orders/");
      // If orders is paginated
      if (res.data.results) {
        setOrdersCount(res.data.count || res.data.results.length);
      } else if (Array.isArray(res.data)) {
        setOrdersCount(res.data.length);
      }
    } catch (err) {
      console.log("Orders count error:", err);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosClient.put("/auth/profile/", profile);
      setProfile(res.data);
      setEditMode(false);
    } catch (err) {
      console.log("Update failed", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ONLY 2 STATS: Orders & Wishlist
  const quickStats = [
    { 
      icon: Package, 
      label: "Orders", 
      value: ordersCount.toString(), 
      color: "from-blue-500 to-cyan-500",
      onClick: () => navigate("/my-orders")
    },
    { 
      icon: Heart, 
      label: "Wishlist", 
      value: (wishlistItems?.length || 0).toString(),
 // Real wishlist count
      color: "from-pink-500 to-red-500",
      onClick: () => navigate("/wishlist")
    },
  ];

  const navItems = [
    { 
      icon: Truck, 
      label: "Track Order", 
      path: "/track-order", 
      color: "from-blue-500 to-cyan-500", 
      desc: "Track your orders" 
    },
    { 
      icon: MapPin, 
      label: "Addresses", 
      path: "/addresses", 
      color: "from-purple-500 to-pink-500", 
      desc: "Manage addresses" 
    },
    { 
      icon: Heart, 
      label: "Wishlist", 
      path: "/wishlist", 
      color: "from-pink-500 to-red-500", 
      desc: "Saved items" 
    },
    { 
      icon: ShoppingCart, 
      label: "My Cart", 
      path: "/cart", 
      color: "from-orange-500 to-yellow-500", 
      desc: "View cart" 
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white/60 via-pink-100/50 to-orange-100/50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white/60 via-pink-100/50 to-orange-100/50 relative overflow-hidden">
      
      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-300/30 to-orange-300/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-red-300/30 to-yellow-300/30 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">

        {/* ================= HERO PROFILE CARD ================= */}
        <div className="relative bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-4 sm:mb-6 overflow-hidden shadow-2xl">
          
          {/* Pattern Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          </div>

          {/* Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"></div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            
            {/* Profile Picture */}
            <div className="relative group">
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-white/20 backdrop-blur-md border-4 border-white/40 flex items-center justify-center shadow-2xl overflow-hidden">
                <UserCircle className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-white" />
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
                <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                {profile.first_name} {profile.last_name}
              </h1>
              <p className="text-white/90 text-sm sm:text-base mb-1 flex items-center justify-center sm:justify-start gap-2">
                <Mail size={16} />
                {profile.email}
              </p>
              {profile.phone && (
                <p className="text-white/90 text-sm sm:text-base flex items-center justify-center sm:justify-start gap-2">
                  <Phone size={16} />
                  {profile.phone}
                </p>
              )}
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="group flex items-center gap-2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border-2 border-white/40 px-5 py-2.5 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <LogOut size={18} className="group-hover:rotate-12 transition-transform duration-300" />
              Logout
            </button>
          </div>
        </div>

        {/* ================= QUICK STATS (ONLY 2) ================= */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {quickStats.map((stat, idx) => (
            <div
              key={idx}
              onClick={stat.onClick}
              className="group relative bg-white/60 backdrop-blur-lg border border-white/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-white/80 cursor-pointer transition-all duration-500 hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-2xl"
            >
              {/* Shine Effect */}
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-transparent via-white/30 to-transparent"></div>

              <div className="relative z-10">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110`}>
                  <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                  {stat.value}
                </p>
              </div>

              {/* Bottom Glow */}
              <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-3 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-30 blur-xl rounded-full transition-all duration-500`}></div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">

          {/* ================= LEFT: QUICK ACTIONS ================= */}
          <div className="lg:col-span-1 space-y-3 sm:space-y-4">
            <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent px-2">
              Quick Actions
            </h2>

            {navItems.map((item, idx) => (
              <div
                key={idx}
                onClick={() => navigate(item.path)}
                className="group relative bg-white/60 backdrop-blur-md border border-white/40 rounded-xl p-4 sm:p-5 hover:bg-white/80 cursor-pointer transition-all duration-500 hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-2xl"
              >
                {/* Shine Effect */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-transparent via-white/30 to-transparent"></div>

                <div className="relative z-10 flex items-center gap-4">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 flex-shrink-0`}>
                    <item.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm sm:text-base font-bold text-gray-800 group-hover:text-red-500 transition-colors duration-300">
                      {item.label}
                    </p>
                    <p className="text-xs text-gray-600">{item.desc}</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-red-500 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                {/* Bottom Glow */}
                <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-3 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-30 blur-xl rounded-full transition-all duration-500`}></div>
              </div>
            ))}
          </div>

          {/* ================= RIGHT: PERSONAL INFORMATION ================= */}
          <div className="lg:col-span-2">
            <div className="relative bg-white/60 backdrop-blur-lg border border-white/40 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl">
              
              {/* Shine Effect */}
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-50"></div>

              <div className="relative z-10 space-y-4 sm:space-y-5">

                {/* Header */}
                <div className="flex justify-between items-center pb-3 border-b border-white/40">
                  <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                    Personal Information
                  </h2>

                  {!editMode && (
                    <button
                      onClick={() => setEditMode(true)}
                      className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                      <Edit size={16} /> Edit Profile
                    </button>
                  )}
                </div>

                {/* ================= NORMAL VIEW ================= */}
                {!editMode && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    
                    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/40 hover:bg-white/70 transition-all duration-300">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                          <UserCircle className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-xs text-gray-500 font-medium">Username</p>
                      </div>
                      <p className="text-gray-800 font-bold text-sm sm:text-base pl-11">{profile.username}</p>
                    </div>

                    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/40 hover:bg-white/70 transition-all duration-300">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-xs text-gray-500 font-medium">Email</p>
                      </div>
                      <p className="text-gray-800 font-bold text-sm sm:text-base pl-11 break-all">{profile.email}</p>
                    </div>

                    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/40 hover:bg-white/70 transition-all duration-300">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <UserCircle className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-xs text-gray-500 font-medium">First Name</p>
                      </div>
                      <p className="text-gray-800 font-bold text-sm sm:text-base pl-11">{profile.first_name}</p>
                    </div>

                    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/40 hover:bg-white/70 transition-all duration-300">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center">
                          <UserCircle className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-xs text-gray-500 font-medium">Last Name</p>
                      </div>
                      <p className="text-gray-800 font-bold text-sm sm:text-base pl-11">{profile.last_name}</p>
                    </div>

                    <div className="sm:col-span-2 bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/40 hover:bg-white/70 transition-all duration-300">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                          <Phone className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-xs text-gray-500 font-medium">Phone Number</p>
                      </div>
                      <p className="text-gray-800 font-bold text-sm sm:text-base pl-11">
                        {profile.phone || "Not added yet"}
                      </p>
                    </div>
                  </div>
                )}

                {/* ================= EDIT MODE FORM ================= */}
                {editMode && (
                  <form onSubmit={updateProfile} className="space-y-4">

                    <div className="text-center py-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200">
                      <h3 className="text-base sm:text-lg font-bold text-gray-800">
                        ✏️ Editing Profile
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm mt-1">Update your information below</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Username</label>
                        <input
                          className="w-full p-3 rounded-lg bg-white/70 backdrop-blur-sm border border-white/50 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-300 text-sm shadow-sm"
                          placeholder="Enter username"
                          value={profile.username}
                          onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          className="w-full p-3 rounded-lg bg-white/70 backdrop-blur-sm border border-white/50 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-300 text-sm shadow-sm"
                          placeholder="Enter email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">First Name</label>
                        <input
                          className="w-full p-3 rounded-lg bg-white/70 backdrop-blur-sm border border-white/50 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-300 text-sm shadow-sm"
                          placeholder="Enter first name"
                          value={profile.first_name}
                          onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Last Name</label>
                        <input
                          className="w-full p-3 rounded-lg bg-white/70 backdrop-blur-sm border border-white/50 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-300 text-sm shadow-sm"
                          placeholder="Enter last name"
                          value={profile.last_name}
                          onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Phone Number</label>
                        <input
                          className="w-full p-3 rounded-lg bg-white/70 backdrop-blur-sm border border-white/50 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-300 text-sm shadow-sm"
                          placeholder="Enter phone number"
                          value={profile.phone || ""}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-4 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Check size={18} /> Save Changes
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditMode(false)}
                        className="flex items-center justify-center gap-2 bg-white/70 backdrop-blur-sm border border-white/50 text-gray-700 hover:bg-white/90 px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <X size={18} /> Cancel
                      </button>
                    </div>
                  </form>
                )}

              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}