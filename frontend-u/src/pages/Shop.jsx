import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import ProductCard from "../components/ProductCard";
import { useSearchParams } from "react-router-dom";
import CategoryBanner from "../components/shop/CategoryBanner";
import { Grid3x3, Grid2X2, LayoutGrid, SlidersHorizontal, Search, Package, ChevronLeft, ChevronRight } from "lucide-react";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category");
  const pageParam = parseInt(searchParams.get("page")) || 1;

  const [categoryInfo, setCategoryInfo] = useState(null);
  const [gridCols, setGridCols] = useState(4);
  const [sortBy, setSortBy] = useState("default");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(pageParam);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  
  // ⭐ Local pagination for 2 rows
  const [localPage, setLocalPage] = useState(1);
  const itemsPerPage = gridCols * 2; // 2 rows

  // Load Products
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        let url = category
          ? `/products/?category=${category}`
          : `/products/`;

        const res = await axiosClient.get(url);

        // Handle response
        if (res.data.results) {
          setProducts(res.data.results);
          setHasNext(Boolean(res.data.next));
          setHasPrev(Boolean(res.data.previous));
          
          if (res.data.count) {
            const pageSize = res.data.results.length || 12;
            setTotalPages(Math.ceil(res.data.count / pageSize));
          }
        } else {
          setProducts(Array.isArray(res.data) ? res.data : []);
          setHasNext(false);
          setHasPrev(false);
          setTotalPages(1);
        }

        if (res.data.category) {
          setCategoryInfo(res.data.category);
        } else {
          setCategoryInfo(null);
        }
        
        // Reset to first page on new data
        setLocalPage(1);
      } catch (error) {
        console.error("Shop fetch error:", error);
      }
      setLoading(false);
    }

    fetchProducts();
  }, [category]);

  // Update URL when page changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (currentPage > 1) {
      params.set("page", currentPage);
    } else {
      params.delete("page");
    }
    if (category) {
      params.set("category", category);
    }
    setSearchParams(params, { replace: true });
  }, [currentPage]);

  // Filter & Sort Products
  const filteredProducts = products
    .filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return (b.average_rating || 0) - (a.average_rating || 0);
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  // ⭐ Paginate filtered products (2 rows)
  const totalLocalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (localPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Grid class
  const getGridClass = () => {
    if (gridCols === 3) return "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5";
    if (gridCols === 4) return "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5";
    if (gridCols === 5) return "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5";
    return "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5";
  };

  // Pagination handlers
  const handlePrevPage = () => {
    if (localPage > 1) {
      setLocalPage(localPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (localPage < totalLocalPages) {
      setLocalPage(localPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Reset local page when grid cols change
  useEffect(() => {
    setLocalPage(1);
  }, [gridCols]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-pink-100/60 to-orange-100/60"></div>
      
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-300/40 to-orange-300/50 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-red-300/50 to-yellow-300/50 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6">
        {/* Category Banner */}
        {categoryInfo && (
          <div className="mb-6">
            <CategoryBanner
              title={categoryInfo.name}
              description={categoryInfo.description}
              image={categoryInfo.banner_image}
            />
          </div>
        )}

        {/* Header & Filters */}
        <div className="mb-6 bg-white/40 backdrop-blur-xl rounded-2xl p-5 shadow-xl border border-white/30">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Title & Count */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-1">
                {categoryInfo ? categoryInfo.name : "All Products"}
              </h1>
              <p className="text-sm text-gray-600">
                {loading ? "Loading..." : `${filteredProducts.length} ${filteredProducts.length === 1 ? "product" : "products"} found`}
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                className="w-full bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all placeholder-gray-500"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Filter Controls */}
          <div className="mt-4 flex flex-wrap gap-3 items-center justify-between">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={18} className="text-gray-600" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all"
              >
                <option value="default">Sort by: Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>

            {/* Grid View Toggle */}
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white/40 rounded-lg p-1">
              <button
                onClick={() => setGridCols(3)}
                className={`p-2 rounded transition-all ${
                  gridCols === 3
                    ? "bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                title="3 Columns"
              >
                <Grid3x3 size={18} />
              </button>
              <button
                onClick={() => setGridCols(4)}
                className={`p-2 rounded transition-all ${
                  gridCols === 4
                    ? "bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                title="4 Columns"
              >
                <Grid2X2 size={18} />
              </button>
              <button
                onClick={() => setGridCols(5)}
                className={`p-2 rounded transition-all ${
                  gridCols === 5
                    ? "bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                title="5 Columns"
              >
                <LayoutGrid size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className={getGridClass()}>
            {[...Array(gridCols * 2)].map((_, idx) => (
              <div
                key={idx}
                className="group bg-white/40 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/30 overflow-hidden relative"
              >
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                <div className="w-full aspect-square bg-gradient-to-br from-pink-100/50 to-orange-100/50 rounded-xl mb-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent"></div>
                </div>
                <div className="space-y-2 mb-3">
                  <div className="h-4 bg-gradient-to-r from-pink-100/50 to-orange-100/50 rounded-full w-3/4"></div>
                  <div className="h-4 bg-gradient-to-r from-pink-100/50 to-orange-100/50 rounded-full w-1/2"></div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-4 bg-gradient-to-r from-yellow-100/50 to-orange-100/50 rounded-full w-20"></div>
                  <div className="h-3 bg-gradient-to-r from-pink-100/50 to-orange-100/50 rounded-full w-12"></div>
                </div>
                <div className="h-6 bg-gradient-to-r from-pink-200/50 to-red-200/50 rounded-full mb-3 w-2/3"></div>
                <div className="h-10 bg-gradient-to-r from-pink-200/50 to-red-200/50 rounded-xl w-full"></div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-12 shadow-xl border border-white/30 text-center max-w-md">
              <Package className="w-20 h-20 mx-auto mb-4 text-gray-400" />
              <p className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-2">
                No Products Found
              </p>
              <p className="text-gray-600">
                {searchTerm ? "Try adjusting your search" : "Check back later for new items"}
              </p>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && paginatedProducts.length > 0 && (
          <div className={getGridClass()}>
            {paginatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        )}

        {/* ⭐ Pagination Buttons - ALWAYS VISIBLE & RESPONSIVE */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={handlePrevPage}
            disabled={localPage === 1}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl font-semibold text-sm sm:text-base text-gray-800 hover:bg-white/80 transition-all shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white/60"
          >
            <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
            <span>Previous</span>
          </button>

          <div className="bg-white/40 backdrop-blur-xl rounded-xl px-4 sm:px-5 py-2 sm:py-3 border border-white/30 shadow-md">
            <span className="font-bold text-sm sm:text-base text-gray-800">
              Page {localPage}
              {totalLocalPages > 1 && <span className="text-gray-600"> of {totalLocalPages}</span>}
            </span>
          </div>

          <button
            onClick={handleNextPage}
            disabled={localPage >= totalLocalPages}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-xl font-semibold text-sm sm:text-base hover:from-pink-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500"
          >
            <span>Next</span>
            <ChevronRight size={18} className="sm:w-5 sm:h-5" />
          </button>
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