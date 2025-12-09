import { motion } from "framer-motion";
import { FiEdit2, FiTrash2, FiMapPin, FiPhone, FiUser } from "react-icons/fi";

export default function AddressList({ addresses, onEdit, onDelete }) {
  // ⭐ FIX: Always ensure addresses is an array
  const list = Array.isArray(addresses) ? addresses : addresses?.results || [];

  if (!list.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center"
          style={{
            boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.8), 0 4px 8px rgba(0,0,0,0.15)'
          }}
        >
          <FiMapPin className="w-12 h-12 text-gray-600" />
        </div>
        <p className="text-gray-600 font-medium">No addresses found.</p>
      </motion.div>
    );
  }

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

      <div className="space-y-4">
        {list.map((addr, index) => (
          <motion.div
            key={addr.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-5 address-card-3d"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              {/* Address Details */}
              <div className="flex-1">
                {/* Name */}
                <div className="info-row">
                  <FiUser className="w-5 h-5 text-gray-600 info-icon" />
                  <p className="font-bold text-lg text-gray-800">{addr.full_name}</p>
                </div>

                {/* Phone */}
                <div className="info-row">
                  <FiPhone className="w-4 h-4 text-gray-500 info-icon" />
                  <p className="text-gray-700">{addr.phone}</p>
                </div>

                {/* Address Lines */}
                <div className="info-row">
                  <FiMapPin className="w-4 h-4 text-gray-500 info-icon" />
                  <div className="text-gray-700">
                    <p>{addr.address_line1}</p>
                    {addr.address_line2 && <p>{addr.address_line2}</p>}
                    <p className="mt-1">
                      {addr.city}, {addr.state} - {addr.postal_code}
                    </p>
                    <p className="text-gray-600 text-sm">{addr.country}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex sm:flex-col gap-2 justify-end">
                <button
                  onClick={() => onEdit(addr)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium btn-icon-3d text-sm"
                >
                  <FiEdit2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit</span>
                </button>

                <button
                  onClick={() => onDelete(addr.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium btn-icon-3d text-sm"
                >
                  <FiTrash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}