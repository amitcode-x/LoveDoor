import { createContext, useContext, useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // check if token exists
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

  const login = async (username, password) => {
    const res = await axiosClient.post("/auth/login/", { username, password });
    localStorage.setItem("access_token", res.data.access);
    localStorage.setItem("refresh_token", res.data.refresh);
    await fetchCurrentUser();
  };

    const register = async (formData) => {
    try {
      const res = await axiosClient.post("/auth/register/", formData);
      localStorage.setItem("access_token", res.data.tokens.access);
      localStorage.setItem("refresh_token", res.data.tokens.refresh);
      await fetchCurrentUser();
    } catch (err) {
      console.log("REGISTER ERROR:", err.response?.data);
      throw err;
    }
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
