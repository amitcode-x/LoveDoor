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
      // 🔥 User not found? Redirect to Register
      if (err.response?.status === 404 || err.response?.data?.error?.includes("not found")) {
        navigate("/register");
        return;
      }
      setError("Invalid email/username or password");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center py-12 px-4">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-pink-100/60 to-orange-100/60"></div>
      
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-300/40 to-orange-300/50 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-red-300/50 to-yellow-300/50 rounded-full blur-3xl"></div>

      {/* Login Form */}
      <div className="relative z-10 w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="group bg-white/40 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/30 hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] transition-all duration-500"
        >
          {/* Shine Effect */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none"></div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-red-500 mb-4 shadow-lg">
              <LogIn className="text-white" size={28} />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h2>
            <p className="text-sm text-gray-600">Login to continue shopping</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-100/80 backdrop-blur-sm border border-red-300 text-red-700 px-4 py-3 rounded-xl text-sm font-semibold animate-shake">
              {error}
            </div>
          )}

          {/* Email/Username Input */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email or Username
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                className="w-full bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all placeholder-gray-500"
                placeholder="Enter your email or username"
                value={form.identifier}
                onChange={(e) =>
                  setForm({ ...form, identifier: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                className="w-full bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl pl-10 pr-12 py-3 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all placeholder-gray-500"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="mb-6 text-right">
            <Link to="/forgot-password" className="text-sm text-pink-600 hover:text-pink-700 font-medium underline">
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-xl font-bold hover:from-pink-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Logging in...
              </>
            ) : (
              <>
                <LogIn size={20} />
                Login
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <span className="px-4 text-gray-500 text-sm font-medium">OR</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>

          {/* Google Login */}
          <div className="flex justify-center mb-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-2 border border-white/40 shadow-md hover:shadow-lg transition-all">
              <GoogleLogin
                onSuccess={(cred) => googleLogin(cred.credential, navigate)}
                onError={() => setError("Google login failed")}
              />
            </div>
          </div>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-pink-600 hover:text-pink-700 font-semibold underline">
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