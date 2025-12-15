import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { X, Trash2, Minus, Plus, ShoppingBag, ShoppingCart, Sparkles } from "lucide-react";
import { useState } from "react";

const getImage = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `http://127.0.0.1:8000${url}`;
};

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
          {/* BACKDROP */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[998]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* DRAWER */}
          <motion.div
            className="fixed top-0 right-0 w-full sm:w-96 h-full z-[999] flex flex-col overflow-hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-pink-50/95 to-orange-50/95 backdrop-blur-xl"></div>
            
            {/* Content */}
            <div className="relative z-10 flex flex-col h-full">
              {/* HEADER */}
              <div className="bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 p-4 sm:p-5 shadow-xl">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg">
                      <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold">Shopping Cart</h2>
                      <p className="text-xs text-white/80">{cart.length} {cart.length === 1 ? "item" : "items"}</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-lg transition-all active:scale-95"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
              </div>

              {/* EMPTY CART */}
              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 sm:w-32 sm:h-32 bg-white/60 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 shadow-xl border border-white/40"
                  >
                    <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
                  </motion.div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h3>
                  <p className="text-gray-600 text-sm mb-6">
                    Add products to get started!
                  </p>
                  <button
                    onClick={onClose}
                    className="px-8 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:from-pink-600 hover:to-red-600 active:scale-95"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <>
                  {/* CART ITEMS */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                    {cart.map((item, index) => {
                      const img = getImage(item.thumbnail || item.images?.[0]?.image_url);
                      return (
                        <motion.div
                          key={item.id}
                          className="group bg-white/60 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg border border-white/40 hover:shadow-xl hover:bg-white/80 transition-all"
                          initial={{ opacity: 0, x: 40 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          {/* Shine Effect */}
                          <div className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none"></div>

                          <div className="flex gap-3 relative z-10">
                            {/* IMAGE */}
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 shadow-md">
                              {img ? (
                                <img
                                  src={img}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                  <ShoppingBag className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                            </div>

                            {/* DETAILS */}
                            <div className="flex-1 min-w-0">
                              {/* Name - Truncated with ellipsis */}
                              <h3 className="font-bold text-gray-800 text-sm sm:text-base truncate pr-8">
                                {item.name}
                              </h3>

                              {/* Price */}
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-lg sm:text-xl font-black bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                                  ₹{item.effective_price}
                                </span>
                                {item.discount_price > 0 && (
                                  <span className="text-xs text-gray-500 line-through">
                                    ₹{item.price}
                                  </span>
                                )}
                              </div>

                              {/* QUANTITY CONTROLS */}
                              <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white/40 rounded-lg px-2 py-1 shadow-sm">
                                  <button
                                    className="w-6 h-6 flex items-center justify-center rounded-md bg-white/80 hover:bg-white shadow-sm transition-all active:scale-95 disabled:opacity-50"
                                    onClick={() =>
                                      item.quantity > 1 &&
                                      updateQty(item.id, item.quantity - 1)
                                    }
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus size={14} />
                                  </button>

                                  <input
                                    type="number"
                                    className="w-10 text-center bg-transparent font-bold text-gray-800 text-sm"
                                    value={item.quantity}
                                    onChange={(e) =>
                                      safeUpdateQty(item.id, e.target.value)
                                    }
                                    min="1"
                                  />

                                  <button
                                    className="w-6 h-6 flex items-center justify-center rounded-md bg-white/80 hover:bg-white shadow-sm transition-all active:scale-95"
                                    onClick={() =>
                                      updateQty(item.id, item.quantity + 1)
                                    }
                                  >
                                    <Plus size={14} />
                                  </button>
                                </div>

                                {/* REMOVE BUTTON */}
                                <button
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all active:scale-95"
                                  onClick={() => setConfirmItem(item)}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* FOOTER */}
                  <div className="bg-white/80 backdrop-blur-xl p-4 sm:p-5 shadow-2xl border-t border-white/40">
                    {/* Subtotal */}
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-bold text-gray-800">₹{totalAmount}</span>
                    </div>

                    {/* Shipping */}
                    <div className="flex justify-between text-sm mb-3">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-green-600 font-bold flex items-center gap-1">
                        <Sparkles size={14} />
                        FREE
                      </span>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center border-t border-white/40 pt-3 mb-4">
                      <span className="text-lg font-bold text-gray-800">Total</span>
                      <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                        ₹{totalAmount}
                      </span>
                    </div>

                    {/* Checkout Button */}
                    <Link
                      to="/checkout"
                      onClick={onClose}
                      className="block w-full py-3 sm:py-4 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-xl font-bold text-center shadow-lg hover:shadow-xl transition-all hover:from-pink-600 hover:to-red-600 active:scale-95 mb-3"
                    >
                      Proceed to Checkout →
                    </Link>

                    {/* Continue Shopping */}
                    <button
                      onClick={onClose}
                      className="w-full py-2.5 sm:py-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl font-semibold text-gray-800 hover:bg-white/80 transition-all shadow-md active:scale-95"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* REMOVE CONFIRM MODAL */}
          <AnimatePresence>
            {confirmItem && (
              <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setConfirmItem(null)}
              >
                <motion.div
                  className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-white/40"
                  initial={{ scale: 0.85, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.85, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-100 to-pink-100 flex items-center justify-center mx-auto mb-4">
                    <Trash2 size={32} className="text-red-600" />
                  </div>

                  <h3 className="text-xl font-bold text-center mb-2 text-gray-800">
                    Remove Item?
                  </h3>

                  <p className="text-sm text-gray-600 text-center mb-6">
                    Remove{" "}
                    <span className="font-bold text-gray-800 block mt-1 truncate">
                      {confirmItem.name}
                    </span>{" "}
                    from your cart?
                  </p>

                  <div className="flex gap-3">
                    <button
                      className="flex-1 py-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl font-semibold text-gray-800 hover:bg-white/80 transition-all active:scale-95"
                      onClick={() => setConfirmItem(null)}
                    >
                      Cancel
                    </button>

                    <button
                      className="flex-1 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-bold hover:from-red-600 hover:to-pink-600 transition-all shadow-lg active:scale-95"
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

          <style>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
}