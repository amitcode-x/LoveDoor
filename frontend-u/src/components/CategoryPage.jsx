import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import CategoryProductCard from "../components/CategoryProductCard";
import CategoryBanner from "../components/shop/CategoryBanner";
import { ChevronLeft, ChevronRight, ChevronRight as BreadcrumbArrow, Package, SlidersHorizontal } from "lucide-react";

export default function CategoryPage() {
  const { slug } = useParams();

  const [loading, setLoading] = useState(true);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [products, setProducts] = useState([]);
  const [ordering, setOrdering] = useState("");
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  useEffect(() => {
    async function fetchCategory() {
      try {
        setLoading(true);

        const response = await axiosClient.get(
          `/products/?category=${slug}&ordering=${ordering}&page=${page}`
        );

        setProducts(Array.isArray(response.data.results) ? response.data.results : []);
        setCategoryInfo(response.data.category || null);
        
        // Pagination
        setHasNext(Boolean(response.data.next));
        setHasPrev(Boolean(response.data.previous));

        setLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        console.error("Category fetch failed", err);
        setLoading(false);
      }
    }

    fetchCategory();
  }, [slug, ordering, page]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-pink-100/60 to-orange-100/60"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-300/40 to-orange-300/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-red-300/50 to-yellow-300/50 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Banner Skeleton */}
          <div className="w-full h-64 bg-white/40 backdrop-blur-xl rounded-2xl border border-white/30 animate-pulse mb-6"></div>

          {/* Products Skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
            {[...Array(8)].map((_, idx) => (
              <div
                key={idx}
                className="group bg-white/40 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/30 overflow-hidden relative"
              >
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                <div className="w-full aspect-square bg-gradient-to-br from-pink-100/50 to-orange-100/50 rounded-xl mb-3"></div>
                <div className="space-y-2 mb-3">
                  <div className="h-4 bg-gradient-to-r from-pink-100/50 to-orange-100/50 rounded-full w-3/4"></div>
                  <div className="h-4 bg-gradient-to-r from-pink-100/50 to-orange-100/50 rounded-full w-1/2"></div>
                </div>
                <div className="h-6 bg-gradient-to-r from-pink-200/50 to-red-200/50 rounded-full mb-3 w-2/3"></div>
                <div className="h-10 bg-gradient-to-r from-pink-200/50 to-red-200/50 rounded-xl w-full"></div>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes shimmer {
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-pink-100/60 to-orange-100/60"></div>
      
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-300/40 to-orange-300/50 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-red-300/50 to-yellow-300/50 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Category Banner */}
        {categoryInfo?.banner_image && (
          <div className="mb-6">
            <CategoryBanner category={categoryInfo} />
          </div>
        )}

        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm flex-wrap">
          <Link to="/" className="text-pink-600 hover:text-pink-700 font-medium">
            Home
          </Link>
          <BreadcrumbArrow size={16} className="text-gray-400" />
          <Link to="/shop" className="text-pink-600 hover:text-pink-700 font-medium">
            Shop
          </Link>
          <BreadcrumbArrow size={16} className="text-gray-400" />
          <span className="text-gray-700 font-semibold capitalize">
            {categoryInfo?.name || slug.replaceAll("-", " ")}
          </span>
        </div>

        {/* Header Section */}
        <div className="mb-6 bg-white/40 backdrop-blur-xl rounded-2xl p-5 shadow-xl border border-white/30">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Title & Count */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-1 capitalize">
                {categoryInfo?.name || slug.replaceAll("-", " ")}
              </h1>
              <p className="text-sm text-gray-600">
                {products.length} {products.length === 1 ? "product" : "products"} available
              </p>
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <SlidersHorizontal size={18} className="text-gray-600" />
              <select
                value={ordering}
                onChange={(e) => setOrdering(e.target.value)}
                className="flex-1 sm:flex-initial bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all"
              >
                <option value="">Sort by: Default</option>
                <option value="price">Price: Low → High</option>
                <option value="-price">Price: High → Low</option>
                <option value="-created_at">Newest First</option>
                <option value="created_at">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Category Description */}
          {categoryInfo?.description && (
            <div className="mt-4 pt-4 border-t border-white/40">
              <p className="text-sm text-gray-700 leading-relaxed">
                {categoryInfo.description}
              </p>
            </div>
          )}
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
              {products.map((p) => (
                <CategoryProductCard key={p.id} product={p} />
              ))}
            </div>

            {/* Pagination - ALWAYS VISIBLE */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <button
                disabled={!hasPrev}
                onClick={() => setPage(page - 1)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl font-semibold text-sm sm:text-base text-gray-800 hover:bg-white/80 transition-all shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white/60"
              >
                <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
                <span>Previous</span>
              </button>

              <div className="bg-white/40 backdrop-blur-xl rounded-xl px-4 sm:px-5 py-2 sm:py-3 border border-white/30 shadow-md">
                <span className="font-bold text-sm sm:text-base text-gray-800">
                  Page {page}
                </span>
              </div>

              <button
                disabled={!hasNext}
                onClick={() => setPage(page + 1)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-xl font-semibold text-sm sm:text-base hover:from-pink-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500"
              >
                <span>Next</span>
                <ChevronRight size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex items-center justify-center py-20">
            <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-12 shadow-xl border border-white/30 text-center max-w-md">
              <Package className="w-20 h-20 mx-auto mb-4 text-gray-400" />
              <p className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-2">
                No Products Found
              </p>
              <p className="text-gray-600">
                This category doesn't have any products yet.
              </p>
              <Link
                to="/shop"
                className="inline-block mt-6 px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-red-600 transition-all shadow-lg"
              >
                Browse All Products
              </Link>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}