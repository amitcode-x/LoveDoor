import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHeart, FiShoppingBag } from "react-icons/fi";

export default function WishlistPage() {
  const { wishlistItems } = useWishlist();

  if (wishlistItems.length === 0) {
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

          .btn-3d:active {
            transform: translateY(0);
            box-shadow: 
              0 2px 4px rgba(0,0,0,0.1),
              inset 0 2px 4px rgba(0,0,0,0.2);
          }

          .icon-3d {
            box-shadow: 
              inset 0 -2px 4px rgba(0,0,0,0.1),
              inset 0 2px 4px rgba(255,255,255,0.8),
              0 8px 16px rgba(0,0,0,0.15);
          }

          .gradient-border {
            position: relative;
          }

          .gradient-border::before {
            content: '';
            position: absolute;
            inset: -2px;
            border-radius: 20px;
            padding: 2px;
            background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            pointer-events: none; /* FIX: buttons now clickable */
          }
        `}</style>

        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-sm w-full"
          >
            {/* Empty State Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 card-3d gradient-border">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
                className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center icon-3d"
              >
                <FiHeart className="w-12 h-12 text-red-500" />
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2"
              >
                Your Wishlist is Empty
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 mb-6 text-sm"
              >
                Save your favorite items here!
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="space-y-2"
              >
                <Link
                  to="/shop"
                  className="block w-full py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-bold rounded-xl btn-3d text-center text-sm"
                >
                  <span className="flex items-center justify-center gap-2">
                    <FiShoppingBag className="w-4 h-4" />
                    Start Shopping
                  </span>
                </Link>

                <Link
                  to="/"
                  className="block w-full py-3 bg-white text-gray-700 font-semibold rounded-xl text-center text-sm"
                  style={{
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  Go to Homepage
                </Link>
              </motion.div>

              {/* Decorative Elements */}
              <div className="mt-6 flex justify-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-300"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-pink-300"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-red-300"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

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

        .stat-card-3d {
          box-shadow: 
            0 2px 4px rgba(0,0,0,0.06),
            0 4px 8px rgba(0,0,0,0.06),
            inset 0 -1px 0 rgba(0,0,0,0.1);
        }

        .product-grid {
          perspective: 1000px;
        }

        @media (max-width: 640px) {
          .product-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
          }
        }

        @media (min-width: 641px) and (max-width: 1024px) {
          .product-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
          }
        }

        @media (min-width: 1025px) {
          .product-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 1.5rem;
          }
        }
      `}</style>

      <div className="page-container py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center"
                style={{
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4), inset 0 -2px 0 rgba(0,0,0,0.2)'
                }}
              >
                <FiHeart className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
                My Wishlist
              </h1>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-4 sm:p-6 max-w-md mx-auto stat-card-3d"
            >
              <div className="flex items-center justify-center gap-6">
                <div className="text-center">
                  <p className="text-3xl sm:text-4xl font-bold text-gray-800">{wishlistItems.length}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {wishlistItems.length === 1 ? 'Item' : 'Items'} Saved
                  </p>
                </div>
                <div className="w-px h-12 bg-gray-300"></div>
                <div className="text-center">
                  <p className="text-lg sm:text-xl font-semibold text-red-500">❤️</p>
                  <p className="text-sm text-gray-600 mt-1">Favorites</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Wishlist products */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="product-grid grid">
              {wishlistItems.map((item, index) => (
                <motion.div
                  key={item.product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                >
                  <ProductCard product={item.product} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Bottom Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link
              to="/shop"
              className="px-8 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold rounded-xl text-center"
              style={{
                boxShadow: '0 4px 12px rgba(0,0,0,0.2), inset 0 -2px 0 rgba(0,0,0,0.3)'
              }}
            >
              Continue Shopping
            </Link>

            <Link
              to="/"
              className="px-8 py-3 bg-white text-gray-700 font-semibold rounded-xl text-center"
              style={{
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              Back to Home
            </Link>
          </motion.div>

        </div>
      </div>
    </>
  );
}
