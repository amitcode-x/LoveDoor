import { motion } from "framer-motion";
import { FiSave, FiX } from "react-icons/fi";

export default function AddressForm({
  form,
  setForm,
  onSubmit,
  onCancel,
  isEditing,
}) {
  const labels = {
    full_name: "Full Name",
    phone: "Phone",
    address_line1: "Address Line 1",
    address_line2: "Address Line 2 (Optional)",
    city: "City",
    state: "State",
    postal_code: "Postal Code",
    country: "Country",
  };

  return (
    <>
      <style>{`
        .form-3d {
          box-shadow: 
            0 4px 6px rgba(0,0,0,0.07),
            0 8px 16px rgba(0,0,0,0.07);
        }

        .input-3d {
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);
          transition: all 0.3s ease;
        }

        .input-3d:focus {
          box-shadow: 
            inset 0 2px 4px rgba(0,0,0,0.06),
            0 0 0 3px rgba(59, 130, 246, 0.1);
          border-color: #3b82f6;
        }

        .btn-form-3d {
          box-shadow: 
            0 4px 6px rgba(0,0,0,0.1),
            inset 0 -2px 0 rgba(0,0,0,0.2);
          transition: all 0.3s ease;
        }

        .btn-form-3d:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 6px 12px rgba(0,0,0,0.15),
            inset 0 -2px 0 rgba(0,0,0,0.2);
        }

        .btn-form-3d:active {
          transform: translateY(0);
          box-shadow: 
            0 2px 4px rgba(0,0,0,0.1),
            inset 0 2px 4px rgba(0,0,0,0.2);
        }

        .form-grid {
          display: grid;
          gap: 1rem;
        }

        @media (min-width: 640px) {
          .form-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .form-full-width {
            grid-column: 1 / -1;
          }
        }
      `}</style>

      <motion.form
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        onSubmit={onSubmit}
        className="bg-white rounded-xl p-6 form-3d mb-6"
      >
        {/* Header */}
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditing ? "Edit Address" : "Add New Address"}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {isEditing ? "Update your address details" : "Fill in your address information"}
          </p>
        </div>

        {/* Form Fields */}
        <div className="form-grid">
          {Object.keys(form).map((key) => {
            const isFullWidth = ['address_line1', 'address_line2'].includes(key);
            
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className={isFullWidth ? "form-full-width" : ""}
              >
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {labels[key]}
                </label>
                <input
                  type="text"
                  className="input-3d border border-gray-300 w-full px-4 py-2.5 rounded-lg focus:outline-none bg-white text-gray-800"
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  required={key !== "address_line2"}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-gray-200">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-3 rounded-lg font-semibold btn-form-3d"
          >
            <FiSave className="w-5 h-5" />
            {isEditing ? "Update Address" : "Save Address"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all"
          >
            <FiX className="w-5 h-5" />
            Cancel
          </button>
        </div>
      </motion.form>
    </>
  );
}