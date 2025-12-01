import { createContext, useEffect, useState } from "react";
import adminAxios from "../api/adminAxios";

export const AdminAuthContext = createContext();

export default function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // ------------------------------
  // Load admin on page refresh
  // ------------------------------
  useEffect(() => {
    async function load() {
      const token = localStorage.getItem("admin_access_token");

      if (!token) {
        setAdmin(null);
        setLoading(false);
        return;
      }

      try {
        const res = await adminAxios.get("/auth/me/");

        if (res.data?.is_staff) {
          setAdmin(res.data);
          localStorage.setItem("admin_user", JSON.stringify(res.data));
        } else {
          localStorage.removeItem("admin_access_token");
          localStorage.removeItem("admin_user");
          setAdmin(null);
        }
      } catch (err) {
        console.error("Admin load error:", err);
        localStorage.removeItem("admin_access_token");
        localStorage.removeItem("admin_user");
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // ------------------------------
  // Admin Login
  // ------------------------------
  const login = async ({ username, password }) => {
    // 1) Login → Token get
    const res = await adminAxios.post("/auth/login/", { username, password });

    const { access, refresh } = res.data || {};
    if (!access) throw new Error("Login failed: no access token received");

    localStorage.setItem("admin_access_token", access);
    if (refresh) {
      localStorage.setItem("admin_refresh_token", refresh);
    }

    // 2) Get profile + staff check
    const meRes = await adminAxios.get("/auth/me/");

    if (!meRes.data?.is_staff) {
      localStorage.removeItem("admin_access_token");
      localStorage.removeItem("admin_refresh_token");
      throw new Error("You are not an admin/staff user");
    }

    setAdmin(meRes.data);
    localStorage.setItem("admin_user", JSON.stringify(meRes.data));
  };

  // ------------------------------
  // Logout
  // ------------------------------
  const logout = () => {
    localStorage.removeItem("admin_access_token");
    localStorage.removeItem("admin_refresh_token");
    localStorage.removeItem("admin_user");
    setAdmin(null);
    window.location.href = "/login";
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}
