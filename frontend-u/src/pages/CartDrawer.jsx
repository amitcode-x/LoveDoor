import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { FiX, FiTrash2, FiMinus, FiPlus, FiShoppingBag } from "react-icons/fi";
import { useState } from "react";

export default function CartDrawer({ open, onClose }) {
  const { cart, updateQty, removeItem, totalAmount } = useCart();
  const [confirmItem, setConfirmItem] = useState(null);

  const safeUpdateQty = (id, value) => {
    let qty = parseInt(value);
    if (!qty || qty < 1) qty = 1;
    updateQty(id, qty);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <style>{`
            .hide-scrollbar::-webkit-scrollbar { display: none; }
            .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

            .card-3d {
              box-shadow: 0 1px 2px rgba(0,0,0,0.07),
                          0 2px 4px rgba(0,0,0,0.07),
                          0 4px 8px rgba(0,0,0,0.07);
              transform: translateZ(0);
              transition: all 0.3s ease;
            }
            .card-3d:hover {
              transform: translateY(-2px);
              box-shadow: 0 2px 6px rgba(0,0,0,0.1),
                          0 4px 12px rgba(0,0,0,0.1);
            }

            .qty-btn {
              width: 24px; height: 24px;
              font-size: 12px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              transition: all 0.2s ease;
            }

            .qty-btn:hover {
              transform: translateY(-1px);
              box-shadow: 0 3px 6px rgba(0,0,0,0.15);
            }

            .icon-3d {
              box-shadow: inset 0 -2px 4px rgba(0,0,0,0.1),
                          inset 0 2px 4px rgba(255,255,255,0.8),
                          0 4px 8px rgba(0,0,0,0.15);
            }

            .btn-3d {
              padding: 10px;
              font-size: 15px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1),
                          inset 0 -2px 0 rgba(0,0,0,0.2);
              transition: 0.25s ease;
            }

            .btn-3d:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 14px rgba(0,0,0,0.15);
            }
          `}</style>

          {/* BACKDROP */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[998]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* DRAWER */}
          <motion.div
            className="fixed top-0 right-0 w-full sm:w-80 h-full bg-gradient-to-bl from-gray-50 to-gray-100 shadow-2xl z-[999] flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* HEADER */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center icon-3d bg-gray-700">
                  <FiShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Shopping Cart</h2>
                  <p className="text-xs text-gray-400">{cart.length} items</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* EMPTY CART */}
            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-24 h-24 bg-gray-200 rounded-full icon-3d flex items-center justify-center mb-4"
                >
                  <FiShoppingBag className="w-12 h-12 text-gray-600" />
                </motion.div>
                <h3 className="text-lg font-bold mb-1">Your Cart is Empty</h3>
                <p className="text-gray-500 text-sm mb-4">
                  Add products to get started!
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-800 text-white rounded-lg btn-3d"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <>
                {/* CART ITEMS */}
                <div className="flex-1 overflow-y-auto hide-scrollbar p-4 space-y-3">
                  {cart.map((item, index) => {
                    const img = item.thumbnail || item.images?.[0]?.image_url;
                    return (
                      <motion.div
                        key={item.id}
                        className="bg-white rounded-lg p-3 card-3d"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.07 }}
                      >
                        <div className="flex gap-3">
                          {/* IMAGE */}
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                            <img
                              src={img}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* DETAILS */}
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 text-sm truncate">
                              {item.name}
                            </h3>

                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-lg font-bold">
                                ₹{item.effective_price}
                              </span>
                            </div>

                            {/* QUANTITY */}
                            <div className="flex justify-between items-center mt-2">
                              <div className="flex items-center gap-2 bg-gray-100 rounded-md px-2 py-1">
                                <button
                                  className="qty-btn flex items-center justify-center rounded-md bg-gray-200"
                                  onClick={() =>
                                    item.quantity > 1 &&
                                    updateQty(item.id, item.quantity - 1)
                                  }
                                >
                                  <FiMinus size={12} />
                                </button>

                                <input
                                  type="number"
                                  className="w-10 text-center bg-transparent font-bold text-gray-800 text-sm"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    safeUpdateQty(item.id, e.target.value)
                                  }
                                />

                                <button
                                  className="qty-btn flex items-center justify-center rounded-md bg-gray-200"
                                  onClick={() =>
                                    updateQty(item.id, item.quantity + 1)
                                  }
                                >
                                  <FiPlus size={12} />
                                </button>
                              </div>

                              {/* REMOVE */}
                              <button
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-md"
                                onClick={() => setConfirmItem(item)}
                              >
                                <FiTrash2 size={15} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* FOOTER */}
                <div className="bg-white p-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Subtotal</span>
                    <span className="font-bold">₹{totalAmount}</span>
                  </div>

                  <div className="flex justify-between text-sm mb-2">
                    <span>Shipping</span>
                    <span className="text-green-600 font-semibold">FREE</span>
                  </div>

                  <div className="flex justify-between items-center border-t pt-3">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold">₹{totalAmount}</span>
                  </div>

                  <Link
                    to="/checkout"
                    onClick={onClose}
                    className="block w-full mt-4 py-3 bg-gray-800 text-white rounded-lg btn-3d text-center"
                  >
                    Checkout →
                  </Link>

                  <button
                    onClick={onClose}
                    className="w-full mt-2 py-2 bg-gray-100 rounded-lg card-3d"
                  >
                    Continue Shopping
                  </button>
                </div>
              </>
            )}
          </motion.div>

          {/* REMOVE CONFIRM MODAL */}
          <AnimatePresence>
            {confirmItem && (
              <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setConfirmItem(null)}
              >
                <motion.div
                  className="bg-white rounded-xl p-6 w-full max-w-sm card-3d"
                  initial={{ scale: 0.85 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.85 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                    <FiTrash2 size={26} className="text-red-600" />
                  </div>

                  <h3 className="text-lg font-bold text-center mb-2">
                    Remove Item?
                  </h3>

                  <p className="text-sm text-gray-600 text-center mb-4">
                    Remove <span className="font-semibold">{confirmItem.name}</span> from your cart?
                  </p>

                  <div className="flex gap-3">
                    <button
                      className="flex-1 py-2 bg-gray-100 rounded-lg"
                      onClick={() => setConfirmItem(null)}
                    >
                      Cancel
                    </button>

                    <button
                      className="flex-1 py-2 bg-red-500 text-white rounded-lg"
                      onClick={() => {
                        removeItem(confirmItem.id);
                        setConfirmItem(null);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
