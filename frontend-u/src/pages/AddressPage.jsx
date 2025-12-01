import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

import AddressList from "../components/address/AddressList";
import AddressForm from "../components/address/AddressForm";

export default function AddressPage() {
  const { user } = useAuth();

  // -----------------------------
  // ⭐ All Hooks MUST be at top
  // -----------------------------
  const emptyForm = {
    full_name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
  };

  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingAddress, setEditingAddress] = useState(null);

  // ⭐ Load addresses only if user logged in
  useEffect(() => {
    if (!user) return;
    axiosClient.get("/auth/addresses/").then((res) => {
      setAddresses(
        Array.isArray(res.data) ? res.data : res.data.results || []
      );
    });
  }, [user]);

  // -----------------------------
  // ⭐ Conditional Rendering AFTER hooks
  // -----------------------------
  if (!user) {
    return (
      <div className="p-6 text-center text-xl">
        Please{" "}
        <Link to="/login" className="text-blue-600 underline">
          login
        </Link>{" "}
        to manage your addresses.
      </div>
    );
  }

  // Submit add/edit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingAddress) {
      await axiosClient.put(`/auth/addresses/${editingAddress.id}/`, form);
    } else {
      await axiosClient.post("/auth/addresses/", form);
    }

    const res = await axiosClient.get("/auth/addresses/");
    setAddresses(Array.isArray(res.data) ? res.data : res.data.results || []);

    setForm(emptyForm);
    setEditingAddress(null);
    setShowForm(false);
  };

  // Edit handler
  const handleEdit = (addr) => {
    setEditingAddress(addr);
    setForm(addr);
    setShowForm(true);
  };

  // Delete handler
  const handleDelete = async (id) => {
    if (window.confirm("Delete this address?")) {
      await axiosClient.delete(`/auth/addresses/${id}/`);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">
        My Addresses
      </h1>

      {/* Add Button */}
      <div className="text-center mb-6">
        <button
          onClick={() => {
            setShowForm(true);
            setEditingAddress(null);
            setForm(emptyForm);
          }}
          className="bg-black text-white px-4 py-2 rounded"
        >
          + Add New Address
        </button>
      </div>

      {/* Address Form */}
      {showForm && (
        <AddressForm
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
          isEditing={!!editingAddress}
        />
      )}

      {/* Address List */}
      <AddressList
        addresses={addresses}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
