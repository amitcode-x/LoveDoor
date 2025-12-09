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
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const res = await axiosClient.get("/auth/me/");
    setProfile(res.data);
    setLoading(false);
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

  if (loading) return <p className="p-6 text-slate-400">Loading profile...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">

      {/* ================= TOP HEADER (User Info + Logout) ================= */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg flex justify-between items-center">
        <div className="flex items-center gap-4">
          <UserCircle className="w-20 h-20 text-slate-300" />
          <div>
            <h1 className="text-2xl font-bold text-slate-100">
              {profile.first_name} {profile.last_name}
            </h1>
            <p className="text-slate-400 text-sm">{profile.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* ================= PROFILE NAV GRID ================= */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

        <div
          onClick={() => navigate("/profile")}
          className="p-5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 cursor-pointer flex items-center gap-4"
        >
          <UserCircle className="w-8 h-8 text-emerald-400" />
          <p className="text-slate-200 font-medium">Profile</p>
        </div>

        <div
          onClick={() => navigate("/my-orders")}
          className="p-5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 cursor-pointer flex items-center gap-4"
        >
          <Package className="w-8 h-8 text-blue-400" />
          <p className="text-slate-200 font-medium">My Orders</p>
        </div>

        <div
          onClick={() => navigate("/addresses")}
          className="p-5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 cursor-pointer flex items-center gap-4"
        >
          <MapPin className="w-8 h-8 text-purple-400" />
          <p className="text-slate-200 font-medium">Addresses</p>
        </div>

        <div
          onClick={() => navigate("/wishlist")}
          className="p-5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 cursor-pointer flex items-center gap-4"
        >
          <Heart className="w-8 h-8 text-pink-400" />
          <p className="text-slate-200 font-medium">Wishlist</p>
        </div>

        <div
          onClick={() => navigate("/cart")}
          className="p-5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 cursor-pointer flex items-center gap-4"
        >
          <ShoppingCart className="w-8 h-8 text-yellow-400" />
          <p className="text-slate-200 font-medium">My Cart</p>
        </div>

        <div
          onClick={() => navigate("/shop")}
          className="p-5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 cursor-pointer flex items-center gap-4"
        >
          <Home className="w-8 h-8 text-teal-400" />
          <p className="text-slate-200 font-medium">Shop</p>
        </div>
      </div>

      {/* ================= PERSONAL INFORMATION ================= */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">

        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-100">Personal Information</h2>

          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-sm"
            >
              <Edit size={16} /> Edit
            </button>
          )}
        </div>

        {/* ================= NORMAL VIEW ================= */}
        {!editMode && (
          <div className="space-y-3 text-slate-300">
            <p><b>Username:</b> {profile.username}</p>
            <p className="flex items-center gap-2"><Mail size={16} /> {profile.email}</p>
            <p className="flex items-center gap-2"><Phone size={16} /> {profile.phone || "Not added"}</p>
          </div>
        )}

        {/* ================= EDIT MODE FORM ================= */}
        {editMode && (
          <form onSubmit={updateProfile} className="space-y-3">

            <div className="text-center mb-4">
              <h2 className="text-lg font-bold text-slate-100">
                Editing: {profile.first_name} {profile.last_name}
              </h2>
              <p className="text-slate-400 text-sm">{profile.email}</p>
            </div>

            <input
              className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white"
              placeholder="Enter username"
              value={profile.username}
              name="username"
              onChange={(e) => setProfile({ ...profile, username: e.target.value })}
            />

            <input
              className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white"
              placeholder="Enter email address"
              value={profile.email}
              name="email"
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />

            <input
              className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white"
              placeholder="Enter first name"
              value={profile.first_name}
              name="first_name"
              onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
            />

            <input
              className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white"
              placeholder="Enter last name"
              value={profile.last_name}
              name="last_name"
              onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
            />

            <input
              className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white"
              placeholder="Enter phone number"
              value={profile.phone || ""}
              name="phone"
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />

            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
            >
              Save Changes
            </button>

            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="ml-3 text-slate-400 hover:text-slate-300"
            >
              Cancel
            </button>

          </form>
        )}

      </div>

    </div>
  );
}
