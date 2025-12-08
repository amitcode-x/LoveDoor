import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("Sending OTP...");

    try {
      const res = await axiosClient.post("/auth/forgot-password/", { email });

      setMessage("OTP has been sent to your email!");
      setTimeout(() => {
        navigate("/verify-otp", { state: { email } });
      }, 800);

    } catch (err) {
      setMessage("");
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <form className="w-full max-w-md border p-6 rounded-lg shadow bg-white" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>

        {message && <p className="text-green-600 text-sm mb-3 text-center">{message}</p>}
        {error && <p className="text-red-600 text-sm mb-3 text-center">{error}</p>}

        <label className="font-medium">Email Address</label>
        <input
          type="email"
          className="border w-full p-2 rounded mt-1"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button className="w-full bg-black text-white py-2 rounded mt-4 hover:bg-gray-900 transition">
          Send OTP
        </button>
      </form>
    </div>
  );
}
