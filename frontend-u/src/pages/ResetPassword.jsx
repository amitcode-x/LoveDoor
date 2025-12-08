import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axiosClient from "../api/axiosClient";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!email) return <p>Email missing</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("Updating password...");

    try {
      await axiosClient.post("/auth/reset-password/", {
        email,
        new_password: password,
      });

      setMessage("Password updated successfully!");
      setTimeout(() => navigate("/login"), 800);

    } catch (err) {
      setMessage("");
      setError("Error resetting password");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <form className="w-full max-w-md border p-6 rounded-lg shadow bg-white" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>

        {message && <p className="text-green-600 text-center mb-3">{message}</p>}
        {error && <p className="text-red-600 text-center mb-3">{error}</p>}

        <label className="font-medium">New Password</label>
        <input
          type="password"
          className="border w-full p-2 rounded mt-1"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="w-full bg-black text-white py-2 rounded mt-4 hover:bg-gray-900 transition">
          Update Password
        </button>
      </form>
    </div>
  );
}
