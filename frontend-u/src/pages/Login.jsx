import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form.identifier, form.password);
      navigate("/");
    } catch (err) {
      if (
        err.response?.status === 404 ||
        err.response?.data?.error?.includes("not found")
      ) {
        navigate("/register");
        return;
      }
      setError("Invalid email/username or password");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center py-10 px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-pink-100/60 to-orange-100/60"></div>

      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-300/40 to-orange-300/50 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-red-300/50 to-yellow-300/50 rounded-full blur-3xl"></div>

      {/* 🔽 COMPACT CARD */}
      <div className="relative z-10 w-full max-w-sm">
        <form
          onSubmit={handleSubmit}
          className="group bg-white/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/30 transition-all duration-500"
        >
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none"></div>

          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-red-500 mb-3 shadow-lg">
              <LogIn className="text-white" size={24} />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              Login to continue shopping
            </p>
          </div>

          {error && (
            <div className="mb-4 bg-red-100/80 border border-red-300 text-red-700 px-3 py-2 rounded-xl text-sm font-semibold animate-shake">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email or Username
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                className="w-full bg-white/60 border border-white/40 rounded-xl pl-9 pr-4 py-2.5 focus:ring-2 focus:ring-pink-400"
                placeholder="Enter your email or username"
                value={form.identifier}
                onChange={(e) =>
                  setForm({ ...form, identifier: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="mb-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type={showPassword ? "text" : "password"}
                className="w-full bg-white/60 border border-white/40 rounded-xl pl-9 pr-11 py-2.5 focus:ring-2 focus:ring-pink-400"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="mb-5 text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-pink-600 hover:text-pink-700 font-medium underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-2.5 rounded-xl font-bold transition-all shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Logging in...
              </>
            ) : (
              <>
                <LogIn size={18} />
                Login
              </>
            )}
          </button>

          <div className="flex items-center my-5">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <span className="px-3 text-gray-500 text-xs font-medium">OR</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>

          <div className="flex justify-center mb-5">
            <div className="bg-white/60 rounded-xl p-2 border border-white/40 shadow-md">
              <GoogleLogin
                onSuccess={(cred) => googleLogin(cred.credential, navigate)}
                onError={() => setError("Google login failed")}
              />
            </div>
          </div>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-pink-600 hover:text-pink-700 font-semibold underline"
            >
              Create Account
            </Link>
          </p>
        </form>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
