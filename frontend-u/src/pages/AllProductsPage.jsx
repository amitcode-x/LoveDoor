import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import ProductCard from "../components/ProductCard";
import Filters from "../components/filters/Filters";
import { ChevronLeft, ChevronRight, Package, SlidersHorizontal } from "lucide-react";

export default function AllProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Pagination state
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // FETCH CATEGORIES
  useEffect(() => {
    axiosClient
      .get("/products/categories/")
      .then((res) => {
        setCategories(
          Array.isArray(res.data.results) ? res.data.results : []
        );
      })
      .catch((err) => {
        console.log("❌ Category fetch error:", err);
        setCategories([]);
      });
  }, []);

  // READ FILTERS FROM URL
  const filters = {
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("min_price") || "",
    maxPrice: searchParams.get("max_price") || "",
    rating: searchParams.get("rating") || "",
    discount: searchParams.get("discount") || "",
    stock: searchParams.get("stock") || "",
    ordering: searchParams.get("ordering") || "",
    show: searchParams.get("show") || "all",
  };

  // FETCH PRODUCTS
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const params = new URLSearchParams();

        if (filters.category) params.append("category", filters.category);
        if (filters.minPrice) params.append("min_price", filters.minPrice);
        if (filters.maxPrice) params.append("max_price", filters.maxPrice);
        if (filters.rating) params.append("rating", filters.rating);
        if (filters.discount) params.append("discount", filters.discount);
        if (filters.stock) params.append("in_stock", filters.stock);
        if (filters.ordering) params.append("ordering", filters.ordering);

        if (filters.show === "offers") params.append("discount", "1");
        if (filters.show === "new") params.append("ordering", "-created_at");

        const url = `/products/?${params.toString()}`;
        const res = await axiosClient.get(url);

        setProducts(Array.isArray(res.data.results) ? res.data.results : []);
        setNextUrl(res.data.next);
        setPrevUrl(res.data.previous);

        setLoading(false);
      } catch (e) {
        console.error("Product fetch failed:", e);
        setLoading(false);
      }
    }

    fetchData();
  }, [
    filters.category,
    filters.minPrice,
    filters.maxPrice,
    filters.rating,
    filters.discount,
    filters.stock,
    filters.ordering,
    filters.show,
  ]);

  // CHANGE PAGE (NEXT / PREVIOUS)
  async function changePage(pageUrl) {
    if (!pageUrl) return;

    try {
      setLoading(true);

      const cleanUrl = pageUrl.replace(axiosClient.defaults.baseURL, "");
      const res = await axiosClient.get(cleanUrl);

      setProducts(res.data.results || []);
      setNextUrl(res.data.next);
      setPrevUrl(res.data.previous);

      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      console.error("Pagination error:", e);
      setLoading(false);
    }
  }

  // APPLY FILTERS
  function applyFilters(updatedFilters) {
    const params = new URLSearchParams();

    if (updatedFilters.category)
      params.append("category", updatedFilters.category);
    if (updatedFilters.minPrice)
      params.append("min_price", updatedFilters.minPrice);
    if (updatedFilters.maxPrice)
      params.append("max_price", updatedFilters.maxPrice);
    if (updatedFilters.rating)
      params.append("rating", updatedFilters.rating);
    if (updatedFilters.discount)
      params.append("discount", updatedFilters.discount);
    if (updatedFilters.stock)
      params.append("in_stock", updatedFilters.stock);
    if (updatedFilters.ordering)
      params.append("ordering", updatedFilters.ordering);

    navigate(`/all-products?${params.toString()}`);
    setShowFilters(false); // Close mobile filters
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-pink-100/60 to-orange-100/60"></div>
      
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-300/40 to-orange-300/50 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-red-300/50 to-yellow-300/50 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-2">
            All Products
          </h1>
          <p className="text-sm text-gray-600">
            Discover our complete collection
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl font-semibold text-gray-800 hover:bg-white/80 transition-all shadow-md"
          >
            <SlidersHorizontal size={20} />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* FILTER SIDEBAR */}
          <div className={`col-span-12 md:col-span-3 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="sticky top-4">
              <Filters
                categories={categories}
                currentFilters={filters}
                applyFilters={applyFilters}
              />
            </div>
          </div>

          {/* PRODUCTS SECTION */}
          <div className="col-span-12 md:col-span-9">
            {/* Loading Skeleton */}
            {loading && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                {[...Array(12)].map((_, idx) => (
                  <div
                    key={idx}
                    className="group bg-white/40 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/30 overflow-hidden relative"
                  >
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                    
                    {/* Image Skeleton */}
                    <div className="w-full aspect-square bg-gradient-to-br from-pink-100/50 to-orange-100/50 rounded-xl mb-3 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent"></div>
                    </div>
                    
                    {/* Title Skeleton */}
                    <div className="space-y-2 mb-3">
                      <div className="h-4 bg-gradient-to-r from-pink-100/50 to-orange-100/50 rounded-full w-3/4"></div>
                      <div className="h-4 bg-gradient-to-r from-pink-100/50 to-orange-100/50 rounded-full w-1/2"></div>
                    </div>
                    
                    {/* Rating Skeleton */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-4 bg-gradient-to-r from-yellow-100/50 to-orange-100/50 rounded-full w-20"></div>
                      <div className="h-3 bg-gradient-to-r from-pink-100/50 to-orange-100/50 rounded-full w-12"></div>
                    </div>
                    
                    {/* Price Skeleton */}
                    <div className="h-6 bg-gradient-to-r from-pink-200/50 to-red-200/50 rounded-full mb-3 w-2/3"></div>
                    
                    {/* Button Skeleton */}
                    <div className="h-10 bg-gradient-to-r from-pink-200/50 to-red-200/50 rounded-xl w-full"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && products.length === 0 && (
              <div className="flex items-center justify-center py-20">
                <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-12 shadow-xl border border-white/30 text-center max-w-md">
                  <Package className="w-20 h-20 mx-auto mb-4 text-gray-400" />
                  <p className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-2">
                    No Products Found
                  </p>
                  <p className="text-gray-600">
                    Try adjusting your filters to see more results
                  </p>
                </div>
              </div>
            )}

            {/* Products Grid */}
            {!loading && products.length > 0 && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>

                {/* Pagination Buttons - ALWAYS VISIBLE */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                  <button
                    onClick={() => changePage(prevUrl)}
                    disabled={!prevUrl}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl font-semibold text-sm sm:text-base text-gray-800 hover:bg-white/80 transition-all shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white/60"
                  >
                    <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
                    <span>Previous</span>
                  </button>

                  <div className="bg-white/40 backdrop-blur-xl rounded-xl px-4 sm:px-5 py-2 sm:py-3 border border-white/30 shadow-md">
                    <span className="font-bold text-sm sm:text-base text-gray-800">
                      {products.length} Products
                    </span>
                  </div>

                  <button
                    onClick={() => changePage(nextUrl)}
                    disabled={!nextUrl}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-xl font-semibold text-sm sm:text-base hover:from-pink-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500"
                  >
                    <span>Next</span>
                    <ChevronRight size={18} className="sm:w-5 sm:h-5" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}