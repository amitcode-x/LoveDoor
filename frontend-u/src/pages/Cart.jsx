import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Package } from "lucide-react";

export default function Cart() {
  const { cart, updateQty, removeItem, totalAmount } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] bg-gradient-to-br from-white/60 via-pink-100/50 to-orange-100/50 relative overflow-hidden">
        {/* Decorative Glows */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-pink-300/30 to-orange-300/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-red-300/30 to-yellow-300/30 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] px-4">
          <div className="text-center bg-white/60 backdrop-blur-lg border border-white/40 rounded-2xl p-6 sm:p-8 shadow-xl max-w-sm">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-2">
              Your Cart is Empty!
            </h2>

            <p className="text-gray-600 mb-4 text-sm">
              Add some items to your cart and they'll appear here.
            </p>

            <Link

          
              to="/shop"
              className=" inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-5 py-2.5 rounded-lg font-semibold shadow-lg transition-all duration-300"
            >
              Start Shopping
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white/60 via-pink-100/50 to-orange-100/50 relative overflow-hidden">

      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-300/30 to-orange-300/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-red-300/30 to-yellow-300/30 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8">

        {/* ================= HEADER ================= */}
        <div className="relative bg-white/60 backdrop-blur-lg border border-white/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-2xl overflow-hidden">

          {/* Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-50"></div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg">
                <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                  Shopping Cart
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">
                  {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
                </p>
              </div>
            </div>

            <Link
              to="/shop"
              className="hidden sm:flex items-center gap-2 text-red-500 hover:text-red-600 font-semibold text-sm transition-colors"
            >
              Continue Shopping
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">

          {/* ================= CART ITEMS ================= */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white/60 backdrop-blur-lg border border-white/40 rounded-xl p-4 sm:p-5 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                {/* Shine Effect */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-transparent via-white/30 to-transparent"></div>

                <div className="relative z-10 flex gap-3 sm:gap-4">

                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gray-100 shadow-md">
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-sm sm:text-base text-gray-800 mb-1 line-clamp-2 group-hover:text-red-500 transition-colors">
                      {item.name}
                    </h2>

                    <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-2 sm:mb-3">
                      ₹{item.effective_price}
                    </p>

                    {/* Qty controls */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-lg border border-white/50 shadow-sm">
                        <button
                          onClick={() => updateQty(item.id, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-l-lg transition-all"
                        >
                          <Minus size={16} />
                        </button>

                        <input
                          type="number"
                          className="w-12 sm:w-14 text-center bg-transparent font-semibold text-gray-800 focus:outline-none text-sm sm:text-base"
                          value={item.quantity}
                          onChange={(e) => updateQty(item.id, parseInt(e.target.value) || 1)}
                          min="1"
                        />

                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-r-lg transition-all"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex items-center gap-1 text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all"
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Item total */}
                  <div className="hidden sm:block text-right">
                    <p className="text-xs text-gray-500 mb-1">Item Total</p>
                    <p className="text-lg font-bold text-gray-800">
                      ₹{(item.effective_price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ================= ORDER SUMMARY ================= */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 relative bg-white/60 backdrop-blur-lg border border-white/40 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl">

              {/* Shine Effect */}
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-50"></div>

              <div className="relative z-10 space-y-4">

                <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent pb-3 border-b border-white/40">
                  Order Summary
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-800">
                      ₹{totalAmount.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>

                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-semibold text-gray-800">Calculated at checkout</span>
                  </div>

                  <div className="border-t border-white/40 pt-3 flex justify-between">
                    <span className="text-base sm:text-lg font-bold text-gray-800">Total</span>
                    <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                      ₹{totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="block w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white text-center py-3 sm:py-4 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  to="/shop"
                  className="block sm:hidden text-center text-red-500 hover:text-red-600 font-semibold text-sm py-2 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
