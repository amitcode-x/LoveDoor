import { createContext, useContext, useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchCurrentUser();
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const res = await axiosClient.get("/auth/me/");
      setUser(res.data);
    } catch (err) {
      console.log("User fetch failed");
    }
  };

  // ⭐ FIXED LOGIN FUNCTION
  const login = async (identifier, password) => {
    const res = await axiosClient.post("/auth/login/", {
      identifier,   // send field backend expects
      password,
    });

    localStorage.setItem("access_token", res.data.tokens.access);
    localStorage.setItem("refresh_token", res.data.tokens.refresh);

    await fetchCurrentUser();
  };

  // Register unchanged
  const register = async (formData) => {
    const res = await axiosClient.post("/auth/register/", formData);
    localStorage.setItem("access_token", res.data.tokens.access);
    localStorage.setItem("refresh_token", res.data.tokens.refresh);
    await fetchCurrentUser();
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
