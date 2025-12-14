import { useSearchParams } from "react-router-dom";
import { Filter, Star, Tag, Package, TrendingUp, X } from "lucide-react";

export default function Filters({
  categories = [],
  currentFilters,
  applyFilters,
}) {
  const [params, setParams] = useSearchParams();

  // Always ensure categories is an array
  const safeCategories = Array.isArray(categories) ? categories : [];

  const updateParam = (key, value) => {
    if (value && value !== "") params.set(key, value);
    else params.delete(key);

    setParams(params);
    applyFilters(Object.fromEntries(params));
  };

  const clearFilters = () => {
    setParams(new URLSearchParams());
    applyFilters({});
  };

  return (
    <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-5 shadow-xl border border-white/30 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/40">
        <div className="flex items-center gap-2">
          <Filter className="text-pink-500" size={20} />
          <h2 className="text-lg font-bold text-gray-800">Filters</h2>
        </div>
      </div>

      {/* CATEGORY FILTER */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2">
          <Tag size={16} className="text-pink-500" />
          Category
        </h3>
        <select
          className="w-full bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all font-medium text-gray-700"
          value={params.get("category") || ""}
          onChange={(e) => updateParam("category", e.target.value)}
        >
          <option value="">All Categories</option>
          {safeCategories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* PRICE RANGE FILTER */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3 text-sm">Price Range</h3>
        <div className="space-y-2">
          <input
            type="number"
            placeholder="Min Price (₹)"
            className="w-full bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all placeholder-gray-500"
            defaultValue={params.get("min_price") || ""}
            onChange={(e) => updateParam("min_price", e.target.value)}
          />
          <input
            type="number"
            placeholder="Max Price (₹)"
            className="w-full bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all placeholder-gray-500"
            defaultValue={params.get("max_price") || ""}
            onChange={(e) => updateParam("max_price", e.target.value)}
          />
        </div>
      </div>

      {/* RATING FILTER */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2">
          <Star size={16} className="text-yellow-500 fill-yellow-500" />
          Rating
        </h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((r) => (
            <button
              key={r}
              onClick={() => updateParam("rating", r)}
              className={`w-full bg-white/60 backdrop-blur-sm border border-white/40 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-white/80 hover:shadow-md flex items-center justify-between ${
                params.get("rating") === String(r)
                  ? "bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-400"
                  : ""
              }`}
            >
              <span className="flex items-center gap-1 text-gray-800">
                {[...Array(r)].map((_, i) => (
                  <Star key={i} size={14} className="text-yellow-500 fill-yellow-500" />
                ))}
              </span>
              <span className="text-gray-600">{r}+ Stars</span>
            </button>
          ))}
        </div>
      </div>

      {/* DISCOUNT FILTER */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2">
          <Tag size={16} className="text-red-500" />
          Discount
        </h3>
        <div className="space-y-2">
          {[10, 20, 30, 40, 50].map((d) => (
            <button
              key={d}
              onClick={() => updateParam("discount", d)}
              className={`w-full bg-white/60 backdrop-blur-sm border border-white/40 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-white/80 hover:shadow-md text-gray-800 ${
                params.get("discount") === String(d)
                  ? "bg-gradient-to-r from-red-100 to-pink-100 border-red-400"
                  : ""
              }`}
            >
              {d}% or more OFF
            </button>
          ))}
        </div>
      </div>

      {/* STOCK FILTER */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2">
          <Package size={16} className="text-green-500" />
          Availability
        </h3>
        <div className="space-y-2">
          <button
            onClick={() => updateParam("in_stock", "true")}
            className={`w-full bg-white/60 backdrop-blur-sm border border-white/40 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-white/80 hover:shadow-md text-gray-800 ${
              params.get("in_stock") === "true"
                ? "bg-gradient-to-r from-green-100 to-emerald-100 border-green-400"
                : ""
            }`}
          >
            ✓ In Stock
          </button>
          <button
            onClick={() => updateParam("in_stock", "false")}
            className={`w-full bg-white/60 backdrop-blur-sm border border-white/40 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-white/80 hover:shadow-md text-gray-800 ${
              params.get("in_stock") === "false"
                ? "bg-gradient-to-r from-gray-100 to-gray-200 border-gray-400"
                : ""
            }`}
          >
            ✗ Out of Stock
          </button>
        </div>
      </div>

      {/* SORTING */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2">
          <TrendingUp size={16} className="text-blue-500" />
          Sort By
        </h3>
        <select
          className="w-full bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all font-medium text-gray-700"
          value={params.get("ordering") || ""}
          onChange={(e) => updateParam("ordering", e.target.value)}
        >
          <option value="">Default</option>
          <option value="price">Price: Low → High</option>
          <option value="-price">Price: High → Low</option>
          <option value="eff_price">Effective Price: Low → High</option>
          <option value="-eff_price">Effective Price: High → Low</option>
          <option value="-created_at">Newest First</option>
          <option value="created_at">Oldest First</option>
        </select>
      </div>

      {/* CLEAR FILTERS */}
      <div className="pt-4 border-t border-white/40">
        <button
          onClick={clearFilters}
          className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-xl font-bold hover:from-red-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          <X size={18} />
          Clear All Filters
        </button>
      </div>
    </div>
  );
}