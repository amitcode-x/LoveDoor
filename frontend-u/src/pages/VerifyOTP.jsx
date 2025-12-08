import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

export default function VerifyOTP() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  const [otp, setOtp] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState(location.state?.message || "OTP sent to your email!"); 
  // 👆 forgot page ka message default me show hoga

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
      <p className="text-center mt-10 text-red-600">
        Email not provided. Go back to Forgot Password.
      </p>
    );
  }

  // =============================
  // VERIFY OTP
  // =============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(""); // ❗ message हटाना नहीं है

    try {
      const res = await axiosClient.post("/auth/verify-otp/", {
        email,
        otp,
      });

      // verify success
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      setError(err.response?.data?.error || "Invalid OTP");
    }
  };

  // =============================
  // RESEND OTP
  // =============================
  const handleResend = async () => {
    try {
      const res = await axiosClient.post("/auth/resend-otp/", { email });

      setMessage("OTP resent successfully!"); // ⭐ message update
      setError("");

      setTimer(60);
      setCanResend(false);
    } catch (err) {
      setError("Unable to resend OTP");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <form className="w-96 border p-6 rounded bg-white" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4 text-center">Verify OTP</h2>

        {/* ⭐ SUCCESS MESSAGE should always remain until verify success */}
        {message && <p className="text-green-600 text-sm mb-3">{message}</p>}

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <p className="text-sm text-gray-600 mb-2">OTP sent to: {email}</p>

        <label className="font-medium">Enter OTP</label>
        <input
          type="text"
          className="border w-full p-2 rounded my-2"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <button className="w-full bg-black text-white py-2 rounded mt-3">
          Verify OTP
        </button>

        {/* RESEND TIMER UI */}
        <div className="mt-4 text-center text-sm">
          {!canResend ? (
            <p className="text-gray-600">
              Resend OTP in <b>{timer}s</b>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-blue-600 underline"
            >
              Resend OTP
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
