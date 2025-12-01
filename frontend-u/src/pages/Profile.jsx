import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    axiosClient.get("/auth/me/").then((res) => {
      setProfile(res.data);
      setLoading(false);
    });
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axiosClient.put("/auth/profile/", profile);
      setProfile(res.data);
      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage("Error updating profile. Try again.");
    }
  };

  if (loading) return <p className="p-6">Loading profile...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      {message && (
        <p className="mb-4 text-green-600 font-medium">{message}</p>
      )}

      <form onSubmit={updateProfile} className="space-y-4 bg-white p-6 border rounded shadow">

        {/* Username */}
        <div>
          <label className="font-medium block mb-1">Username</label>
          <input
            name="username"
            className="border p-2 w-full rounded"
            value={profile.username}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="font-medium block mb-1">Email</label>
          <input
            name="email"
            type="email"
            className="border p-2 w-full rounded"
            value={profile.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* First Name */}
        <div>
          <label className="font-medium block mb-1">First Name</label>
          <input
            name="first_name"
            className="border p-2 w-full rounded"
            value={profile.first_name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="font-medium block mb-1">Last Name</label>
          <input
            name="last_name"
            className="border p-2 w-full rounded"
            value={profile.last_name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="font-medium block mb-1">Phone</label>
          <input
            name="phone"
            className="border p-2 w-full rounded"
            value={profile.phone || ""}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded mt-2"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
