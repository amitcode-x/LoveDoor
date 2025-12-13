import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { Shield, Mail, RotateCw, Clock, CheckCircle } from "lucide-react";

export default function VerifyOTP() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  const [otp, setOtp] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState(location.state?.message || "OTP sent to your email!");
  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // countdown timer
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }

    const t = setTimeout(() => setTimer((prev) => prev - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  if (!email) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-pink-100/60 to-orange-100/60"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-300/40 to-orange-300/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-red-300/50 to-yellow-300/50 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 bg-white/40 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/30 text-center">
          <p className="text-red-600 font-semibold">
            Email not provided. Go back to Forgot Password.
          </p>
        </div>
      </div>
    );
  }

  // VERIFY OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axiosClient.post("/auth/verify-otp/", {
        email,
        otp,
      });

      // verify success
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      setError(err.response?.data?.error || "Invalid OTP");
      setLoading(false);
    }
  };

  // RESEND OTP
  const handleResend = async () => {
    try {
      const res = await axiosClient.post("/auth/resend-otp/", { email });

      setMessage("OTP resent successfully!");
      setError("");

      setTimer(60);
      setCanResend(false);
    } catch (err) {
      setError("Unable to resend OTP");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center py-12 px-4">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-pink-100/60 to-orange-100/60"></div>
      
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-300/40 to-orange-300/50 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-red-300/50 to-yellow-300/50 rounded-full blur-3xl"></div>

      {/* Verify OTP Form */}
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
              <Shield className="text-white" size={28} />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-2">
              Verify OTP
            </h2>
            <p className="text-sm text-gray-600">
              Enter the code sent to your email
            </p>
          </div>

          {/* Success Message */}
          {message && (
            <div className="mb-4 bg-green-100/80 backdrop-blur-sm border border-green-300 text-green-700 px-4 py-3 rounded-xl text-sm font-semibold animate-slideDown flex items-center gap-2">
              <CheckCircle size={18} />
              {message}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-100/80 backdrop-blur-sm border border-red-300 text-red-700 px-4 py-3 rounded-xl text-sm font-semibold animate-shake">
              {error}
            </div>
          )}

          {/* Email Display */}
          <div className="mb-4 bg-blue-50/60 backdrop-blur-sm border border-blue-200/50 rounded-xl p-3 flex items-center gap-2">
            <Mail size={16} className="text-blue-600" />
            <p className="text-sm text-gray-700">
              <span className="font-semibold">OTP sent to:</span> {email}
            </p>
          </div>

          {/* OTP Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Enter OTP
            </label>
            <input
              type="text"
              className="w-full bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl px-4 py-3 text-center text-2xl font-bold tracking-widest focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all placeholder-gray-400"
              placeholder="• • • • • •"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              required
            />
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
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                Verify OTP
              </>
            )}
          </button>

          {/* Resend Timer UI */}
          <div className="mt-6 text-center">
            {!canResend ? (
              <div className="bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl px-4 py-3 flex items-center justify-center gap-2">
                <Clock size={16} className="text-gray-600 animate-pulse" />
                <p className="text-sm text-gray-700">
                  Resend OTP in <span className="font-bold text-pink-600">{timer}s</span>
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="w-full bg-white/70 backdrop-blur-sm border border-white/50 text-gray-800 py-3 rounded-xl font-semibold hover:bg-white/90 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <RotateCw size={18} />
                Resend OTP
              </button>
            )}
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Didn't receive the code? Check your spam folder
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