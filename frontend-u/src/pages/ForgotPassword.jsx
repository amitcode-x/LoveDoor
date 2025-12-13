import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { Mail, Send, KeyRound, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("Sending OTP...");
    setLoading(true);

    try {
      const res = await axiosClient.post("/auth/forgot-password/", { email });

      setMessage("OTP has been sent to your email!");
      setTimeout(() => {
        navigate("/verify-otp", { state: { email } });
      }, 800);

    } catch (err) {
      setMessage("");
      setError(err.response?.data?.error || "Something went wrong");
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

      {/* Forgot Password Form */}
      <div className="relative z-10 w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="group bg-white/40 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/30 hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] transition-all duration-500"
        >
          {/* Shine Effect */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none"></div>

          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="absolute top-4 left-4 p-2 rounded-lg bg-white/60 backdrop-blur-sm border border-white/40 hover:bg-white/80 transition-all text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={18} />
          </button>

          {/* Header */}
          <div className="text-center mb-8 mt-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-red-500 mb-4 shadow-lg">
              <KeyRound className="text-white" size={28} />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-2">
              Forgot Password?
            </h2>
            <p className="text-sm text-gray-600">
              Enter your email to receive OTP
            </p>
          </div>

          {/* Success Message */}
          {message && (
            <div className="mb-4 bg-green-100/80 backdrop-blur-sm border border-green-300 text-green-700 px-4 py-3 rounded-xl text-sm font-semibold animate-slideDown flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              {message}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-100/80 backdrop-blur-sm border border-red-300 text-red-700 px-4 py-3 rounded-xl text-sm font-semibold animate-shake">
              {error}
            </div>
          )}

          {/* Email Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                className="w-full bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all placeholder-gray-500"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
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
                Sending OTP...
              </>
            ) : (
              <>
                <Send size={20} />
                Send OTP
              </>
            )}
          </button>

          {/* Info Text */}
          <div className="mt-6 bg-blue-50/60 backdrop-blur-sm border border-blue-200/50 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-600">
              We'll send a One-Time Password (OTP) to your registered email address to verify your identity.
            </p>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}