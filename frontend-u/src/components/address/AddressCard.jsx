import { motion } from "framer-motion";
import { FiEdit2, FiTrash2, FiMapPin, FiPhone, FiUser } from "react-icons/fi";

export default function AddressCard({ address, onEdit, onDelete }) {
  return (
    <>
      <style>{`
        .address-card-3d {
          box-shadow: 
            0 2px 4px rgba(0,0,0,0.06),
            0 4px 8px rgba(0,0,0,0.06),
            0 8px 16px rgba(0,0,0,0.04);
          transition: all 0.3s ease;
        }

        .address-card-3d:hover {
          transform: translateY(-4px);
          box-shadow: 
            0 4px 8px rgba(0,0,0,0.08),
            0 8px 16px rgba(0,0,0,0.08),
            0 16px 24px rgba(0,0,0,0.06);
        }

        .btn-icon-3d {
          box-shadow: 
            0 2px 4px rgba(0,0,0,0.1),
            inset 0 -1px 0 rgba(0,0,0,0.2);
          transition: all 0.2s ease;
        }

        .btn-icon-3d:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 4px 8px rgba(0,0,0,0.15),
            inset 0 -1px 0 rgba(0,0,0,0.2);
        }

        .btn-icon-3d:active {
          transform: translateY(0);
          box-shadow: 
            0 1px 2px rgba(0,0,0,0.1),
            inset 0 1px 2px rgba(0,0,0,0.15);
        }

        .info-row {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .info-icon {
          flex-shrink: 0;
          margin-top: 0.15rem;
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-5 address-card-3d"
      >
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
          {/* Address Details */}
          <div className="flex-1">
            {/* Name */}
            <div className="info-row">
              <FiUser className="w-5 h-5 text-gray-600 info-icon" />
              <p className="font-bold text-lg text-gray-800">{address.full_name}</p>
            </div>

            {/* Phone */}
            <div className="info-row">
              <FiPhone className="w-4 h-4 text-gray-500 info-icon" />
              <p className="text-gray-700">{address.phone}</p>
            </div>

            {/* Address Lines */}
            <div className="info-row">
              <FiMapPin className="w-4 h-4 text-gray-500 info-icon" />
              <div className="text-gray-700">
                <p>{address.address_line1}</p>
                {address.address_line2 && <p>{address.address_line2}</p>}
                <p className="mt-1">
                  {address.city}, {address.state} - {address.postal_code}
                </p>
                <p className="text-gray-600 text-sm">{address.country}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex sm:flex-col gap-2 justify-end">
            <button
              onClick={() => onEdit(address)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium btn-icon-3d text-sm"
            >
              <FiEdit2 className="w-4 h-4" />
              <span className="hidden sm:inline">Edit</span>
            </button>

            <button
              onClick={() => onDelete(address.id)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium btn-icon-3d text-sm"
            >
              <FiTrash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}