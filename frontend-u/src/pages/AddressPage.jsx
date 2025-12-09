import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMapPin, FiPlus, FiLogIn } from "react-icons/fi";

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
      <>
        <style>{`
          .card-3d {
            box-shadow: 
              0 4px 6px rgba(0,0,0,0.07),
              0 8px 16px rgba(0,0,0,0.07);
          }

          .btn-3d {
            box-shadow: 
              0 4px 6px rgba(0,0,0,0.1),
              inset 0 -2px 0 rgba(0,0,0,0.2);
            transition: all 0.3s ease;
          }

          .btn-3d:hover {
            transform: translateY(-2px);
            box-shadow: 
              0 6px 12px rgba(0,0,0,0.15),
              inset 0 -2px 0 rgba(0,0,0,0.2);
          }

          .icon-3d {
            box-shadow: 
              inset 0 -2px 4px rgba(0,0,0,0.1),
              inset 0 2px 4px rgba(255,255,255,0.8),
              0 8px 16px rgba(0,0,0,0.15);
          }
        `}</style>

        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-sm w-full"
          >
            <div className="bg-white rounded-2xl p-6 sm:p-8 card-3d">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center icon-3d"
              >
                <FiLogIn className="w-12 h-12 text-blue-600" />
              </motion.div>

              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Login Required
              </h1>

              <p className="text-gray-600 mb-6 text-sm">
                Please login to manage your addresses
              </p>

              <Link
                to="/login"
                className="block w-full py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-bold rounded-xl btn-3d text-center text-sm"
              >
                Login Now
              </Link>
            </div>
          </motion.div>
        </div>
      </>
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
    <>
      <style>{`
        .page-container {
          min-height: calc(100vh - 80px);
          background: linear-gradient(to bottom right, #f9fafb, #f3f4f6);
        }

        .header-3d {
          box-shadow: 
            0 4px 6px rgba(0,0,0,0.07),
            0 1px 3px rgba(0,0,0,0.06);
        }

        .btn-primary-3d {
          box-shadow: 
            0 4px 6px rgba(0,0,0,0.1),
            inset 0 -2px 0 rgba(0,0,0,0.2);
          transition: all 0.3s ease;
        }

        .btn-primary-3d:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 6px 12px rgba(0,0,0,0.15),
            inset 0 -2px 0 rgba(0,0,0,0.2);
        }

        .btn-primary-3d:active {
          transform: translateY(0);
          box-shadow: 
            0 2px 4px rgba(0,0,0,0.1),
            inset 0 2px 4px rgba(0,0,0,0.2);
        }

        .icon-container-3d {
          box-shadow: 
            inset 0 -2px 4px rgba(0,0,0,0.1),
            inset 0 2px 4px rgba(255,255,255,0.8),
            0 4px 8px rgba(0,0,0,0.15);
        }
      `}</style>

      <div className="page-container py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 sm:mb-8"
          >
            {/* Title & Icon */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center icon-container-3d">
                <FiMapPin className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
                My Addresses
              </h1>
            </div>

            {/* Stats Card */}
            {addresses.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-4 max-w-xs mx-auto header-3d"
              >
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-800">{addresses.length}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Saved {addresses.length === 1 ? 'Address' : 'Addresses'}
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Add Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-6"
          >
            <button
              onClick={() => {
                setShowForm(true);
                setEditingAddress(null);
                setForm(emptyForm);
              }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-3 rounded-xl font-semibold btn-primary-3d"
            >
              <FiPlus className="w-5 h-5" />
              Add New Address
            </button>
          </motion.div>

          {/* Address Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-6"
              >
                <AddressForm
                  form={form}
                  setForm={setForm}
                  onSubmit={handleSubmit}
                  onCancel={() => setShowForm(false)}
                  isEditing={!!editingAddress}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Address List */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <AddressList
              addresses={addresses}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </motion.div>

          {/* Empty State */}
          {addresses.length === 0 && !showForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center py-12"
            >
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center icon-container-3d">
                <FiMapPin className="w-16 h-16 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                No Addresses Yet
              </h3>
              <p className="text-gray-600 mb-6 text-sm">
                Add your first address to get started
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}