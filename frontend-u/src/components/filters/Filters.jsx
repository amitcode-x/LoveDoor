import { useSearchParams } from "react-router-dom";

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

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white space-y-6">
      {/* CATEGORY FILTER */}
      <div>
        <h3 className="font-semibold mb-2">Category</h3>

        <select
          className="w-full border p-2 rounded"
          value={params.get("category") || ""}
          onChange={(e) => updateParam("category", e.target.value)}
        >
          <option value="">All</option>

          {safeCategories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* PRICE RANGE FILTER */}
      <div>
        <h3 className="font-semibold mb-2">Price Range</h3>

        <input
          type="number"
          placeholder="Min"
          className="w-full border p-2 rounded mb-2"
          defaultValue={params.get("min_price") || ""}
          onChange={(e) => updateParam("min_price", e.target.value)}
        />

        <input
          type="number"
          placeholder="Max"
          className="w-full border p-2 rounded"
          defaultValue={params.get("max_price") || ""}
          onChange={(e) => updateParam("max_price", e.target.value)}
        />
      </div>

      {/* RATING FILTER */}
      <div>
        <h3 className="font-semibold mb-2">Rating</h3>
        {[4, 3, 2, 1].map((r) => (
          <button
            key={r}
            onClick={() => updateParam("rating", r)}
            className="block w-full border p-2 rounded mb-1 hover:bg-gray-100"
          >
            {r}+ Stars
          </button>
        ))}
      </div>

      {/* DISCOUNT FILTER */}
      <div>
        <h3 className="font-semibold mb-2">Discount</h3>
        {[10, 20, 30, 40, 50].map((d) => (
          <button
            key={d}
            onClick={() => updateParam("discount", d)}
            className="block w-full border p-2 rounded mb-1 hover:bg-gray-100"
          >
            {d}% or more
          </button>
        ))}
      </div>

      {/* STOCK FILTER */}
      <div>
        <h3 className="font-semibold mb-2">Availability</h3>

        <button
          onClick={() => updateParam("in_stock", "true")}
          className="block w-full border p-2 rounded mb-2 hover:bg-gray-100"
        >
          In Stock
        </button>

        <button
          onClick={() => updateParam("in_stock", "false")}
          className="block w-full border p-2 rounded hover:bg-gray-100"
        >
          Out of Stock
        </button>
      </div>

      {/* SORTING */}
      <div>
        <h3 className="font-semibold mb-2">Sort By</h3>

        <select
          className="w-full border p-2 rounded"
          value={params.get("ordering") || ""}
          onChange={(e) => updateParam("ordering", e.target.value)}
        >
          <option value="">Default</option>

        

          {/* REAL PRICE SORT */}
          <option value="price">Price: Low → High</option>
          <option value="-price">Price: High → Low</option>

          {/* EFFECTIVE PRICE SORT */}
          <option value="eff_price">Effective Price: Low → High</option>
          <option value="-eff_price">Effective Price: High → Low</option>

          {/* DATE SORT */}
          <option value="-created_at">Newest First</option>
          <option value="created_at">Oldest First</option>
        </select>
      </div>

        {/* CLEAR FILTERS */}
          <div className="pt-4 border-t">
            <button
              onClick={() => {
                // Clear ALL query params
                setParams(new URLSearchParams());
                applyFilters({});
              }}
              className="w-full bg-red-500 text-white py-2 rounded mt-3 hover:bg-red-600"
            >
              Clear Filters
            </button>
          </div>
    </div>
  );
}
