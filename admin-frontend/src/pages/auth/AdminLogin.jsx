import { useState } from "react";
import { useAuth } from "../../auth/useAuth";

export default function AdminLogin() {
  const { login } = useAuth();

  const [form, setForm] = useState({
    identifier: "",   // ⭐ Username or Email dono yahan ayega
    password: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Backend expects "identifier"
      await login({
        username: form.identifier, // ⭐ send as username because context converts it to identifier
        password: form.password,
      });

      window.location.href = "/"; // success redirect
    } catch (err) {
      setError("Invalid credentials or not an admin user");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 shadow-lg p-8 rounded-lg w-96 border border-gray-700"
      >
        <h2 className="text-2xl font-bold mb-4 text-white text-center">
          Admin Login
        </h2>

        {error && (
          <p className="text-red-400 text-sm mb-3 text-center">{error}</p>
        )}

        {/* Identifier */}
        <label className="text-gray-300 text-sm mb-1 block">
          Email or Username
        </label>
        <input
          type="text"
          placeholder="admin@example.com"
          className="border border-gray-600 bg-gray-700 text-white p-2 w-full mb-4 rounded"
          value={form.identifier}
          onChange={(e) =>
            setForm({ ...form, identifier: e.target.value })
          }
          required
        />

        {/* Password */}
        <label className="text-gray-300 text-sm mb-1 block">Password</label>
        <input
          type="password"
          placeholder="••••••••"
          className="border border-gray-600 bg-gray-700 text-white p-2 w-full mb-4 rounded"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          required
        />

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
