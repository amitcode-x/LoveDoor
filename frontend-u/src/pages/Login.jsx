// src/pages/Login.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(form.identifier, form.password);
      navigate("/");
    } catch (err) {
      setError("Invalid email/username or password");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md border p-6 rounded-lg shadow bg-white"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        <label className="font-medium">Email or Username</label>
        <input
          type="text"
          className="border w-full p-2 rounded mt-1"
          value={form.identifier}
          onChange={(e) =>
            setForm({ ...form, identifier: e.target.value })
          }
          required
        />

        <label className="font-medium mt-3 block">Password</label>
        <input
          type="password"
          className="border w-full p-2 rounded mt-1"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <div className="mt-2 text-right">
          <Link to="/forgot-password" className="text-blue-600 text-sm underline">
            Forgot Password?
          </Link>
        </div>

        <button className="w-full bg-black text-white py-2 rounded mt-4 hover:bg-gray-900 transition">
          Login
        </button>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-2 text-gray-500 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* GOOGLE LOGIN BUTTON */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={(cred) => googleLogin(cred.credential, navigate)}
            onError={() => setError("Google login failed")}
          />
        </div>

        <p className="text-center mt-4 text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
