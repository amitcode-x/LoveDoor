import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    confirm_password: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm_password) {
      setError("Passwords do not match!");
      return;
    }

    try {
      await register(form);
      navigate("/"); // successful register
    } catch (err) {
      setError("Registration failed. Try another username/email.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <form
        onSubmit={handleSubmit}
        className="w-96 border p-6 rounded shadow-md bg-white"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Create Account</h2>

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        <div className="mb-3">
          <label className="block font-medium mb-1">Username</label>
          <input
            className="border w-full p-2 rounded"
            value={form.username}
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
            required
          />
        </div>

        <div className="mb-3">
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            className="border w-full p-2 rounded"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>

        <div className="mb-3 flex gap-3">
          <div className="w-1/2">
            <label className="block font-medium mb-1">First Name</label>
            <input
              className="border w-full p-2 rounded"
              value={form.first_name}
              onChange={(e) =>
                setForm({ ...form, first_name: e.target.value })
              }
              required
            />
          </div>

          <div className="w-1/2">
            <label className="block font-medium mb-1">Last Name</label>
            <input
              className="border w-full p-2 rounded"
              value={form.last_name}
              onChange={(e) =>
                setForm({ ...form, last_name: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="block font-medium mb-1">Password</label>
          <input
            type="password"
            className="border w-full p-2 rounded"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            required
          />
        </div>

        <div className="mb-3">
          <label className="block font-medium mb-1">Confirm Password</label>
          <input
            type="password"
            className="border w-full p-2 rounded"
            value={form.confirm_password}
            onChange={(e) =>
              setForm({ ...form, confirm_password: e.target.value })
            }
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded mt-3"
        >
          Register
        </button>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
