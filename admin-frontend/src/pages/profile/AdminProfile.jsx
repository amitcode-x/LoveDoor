// src/pages/profile/AdminProfile.jsx
import { useEffect, useState } from "react";
import {
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
} from "../../api/adminApi";

import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";

export default function AdminProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError("");
        const res = await getAdminProfile();
        setProfile(res.data);
        setFormData({
          first_name: res.data.first_name || "",
          last_name: res.data.last_name || "",
          email: res.data.email || "",
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      setError("");
      const res = await updateAdminProfile(formData);
      setProfile(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      setChangingPassword(true);
      setError("");
      await changeAdminPassword(passwordData);
      alert("Password updated successfully. Please login again with new password.");
      setPasswordData({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (err) {
      console.error(err);
      let msg = "Failed to change password.";
      if (err.response?.data) {
        // Errors from serializer
        const data = err.response.data;
        if (typeof data === "string") msg = data;
        else {
          const firstKey = Object.keys(data)[0];
          if (firstKey) {
            msg = Array.isArray(data[firstKey])
              ? data[firstKey][0]
              : data[firstKey];
          }
        }
      }
      setError(msg);
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!profile) {
    return (
      <Card>
        <p className="text-sm text-red-400 mb-3">{error || "Profile not found."}</p>
      </Card>
    );
  }

  const fullName =
    (profile.first_name || profile.last_name)
      ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
      : profile.username;

  const initial = (fullName || "?").charAt(0).toUpperCase();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-50">Admin Profile</h1>
          <p className="text-xs text-slate-400">
            Manage your account details and security.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-emerald-500/80 flex items-center justify-center text-slate-900 font-bold text-lg">
            {initial}
          </div>
          <div className="text-xs text-slate-300">
            <div className="font-medium">{fullName}</div>
            <div className="text-[11px] text-emerald-300">
              {profile.is_superuser
                ? "Super Admin"
                : profile.is_staff
                ? "Admin"
                : "User"}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <Card>
          <p className="text-xs text-red-400">{error}</p>
        </Card>
      )}

      {/* Top info cards */}
      <div className="grid md:grid-cols-3 gap-3">
        <Card>
          <p className="text-[11px] text-slate-400">Username</p>
          <p className="text-sm text-slate-100 font-medium mt-1">
            {profile.username}
          </p>
        </Card>
        <Card>
          <p className="text-[11px] text-slate-400">Last Login</p>
          <p className="text-sm text-slate-100 mt-1">
            {profile.last_login
              ? new Date(profile.last_login).toLocaleString()
              : "Never"}
          </p>
        </Card>
        <Card>
          <p className="text-[11px] text-slate-400">Joined</p>
          <p className="text-sm text-slate-100 mt-1">
            {profile.date_joined
              ? new Date(profile.date_joined).toLocaleDateString()
              : "-"}
          </p>
        </Card>
      </div>

      {/* Profile form + Change password */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Profile details */}
        <Card>
          <h2 className="text-sm font-semibold text-slate-50 mb-3">
            Profile Details
          </h2>

          <form onSubmit={handleProfileSubmit} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300">First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleProfileChange}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleProfileChange}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleProfileChange}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={savingProfile}>
                {savingProfile ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Card>

        {/* Change password */}
        <Card>
          <h2 className="text-sm font-semibold text-slate-50 mb-3">
            Change Password
          </h2>

          <form onSubmit={handlePasswordSubmit} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300">Current Password</label>
              <input
                type="password"
                name="old_password"
                value={passwordData.old_password}
                onChange={handlePasswordChange}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300">New Password</label>
              <input
                type="password"
                name="new_password"
                value={passwordData.new_password}
                onChange={handlePasswordChange}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300">Confirm New Password</label>
              <input
                type="password"
                name="confirm_password"
                value={passwordData.confirm_password}
                onChange={handlePasswordChange}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={changingPassword}>
                {changingPassword ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
