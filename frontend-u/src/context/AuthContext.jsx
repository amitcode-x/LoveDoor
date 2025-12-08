// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // When token found, auto-load user
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const res = await axiosClient.get("/auth/me/");
      setUser(res.data);
    } catch (err) {
      console.log("User fetch failed");
    }
  };

  // -------------------------------
  // ⭐ Normal Login (email OR username)
  // -------------------------------
  const login = async (identifier, password) => {
    const res = await axiosClient.post("/auth/login/", {
      username: identifier,
      password,
    });

    localStorage.setItem("access_token", res.data.tokens.access);
    localStorage.setItem("refresh_token", res.data.tokens.refresh);

    await fetchCurrentUser();
  };

  // -------------------------------
  // ⭐ GOOGLE LOGIN (frontend → backend verify)
  // -------------------------------
  const googleLogin = async (googleToken, navigate) => {
    try {
      const res = await axiosClient.post("/auth/google-login/", {
        credential: googleToken,
      });

      localStorage.setItem("access_token", res.data.tokens.access);
      localStorage.setItem("refresh_token", res.data.tokens.refresh);

      await fetchCurrentUser();
      navigate("/");
    } catch (err) {
      console.log("GOOGLE LOGIN ERROR:", err.response?.data);
      alert("Google Login failed");
    }
  };

  // -------------------------------
  // ⭐ REGISTER
  // -------------------------------
  const register = async (formData) => {
    const res = await axiosClient.post("/auth/register/", formData);
    localStorage.setItem("access_token", res.data.tokens.access);
    localStorage.setItem("refresh_token", res.data.tokens.refresh);
    await fetchCurrentUser();
  };

  // -------------------------------
  // ⭐ LOGOUT
  // -------------------------------
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        googleLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
