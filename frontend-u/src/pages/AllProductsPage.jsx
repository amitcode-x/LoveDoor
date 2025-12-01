import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import ProductCard from "../components/ProductCard";
import Filters from "../components/filters/Filters";

export default function AllProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);



useEffect(() => {
  axiosClient.get("/products/categories/")
    .then(res => {
      console.log("💥 Backend categories response:", res.data);
      
      setCategories(
        Array.isArray(res.data.results) ? res.data.results : []
      );
    })
    .catch(err => {
      console.log("❌ Category fetch error:", err);
      setCategories([]);
    });
}, []);



  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Read filters from URL
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

  // -------------------------
  // ⭐ FETCH PRODUCTS
  // -------------------------
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const params = new URLSearchParams();

        // Only append non-empty filters
        if (filters.category) params.append("category", filters.category);
        if (filters.minPrice) params.append("min_price", filters.minPrice);
        if (filters.maxPrice) params.append("max_price", filters.maxPrice);
        if (filters.rating) params.append("rating", filters.rating);
        if (filters.discount) params.append("discount", filters.discount);
        if (filters.stock) params.append("in_stock", filters.stock);
        if (filters.ordering) params.append("ordering", filters.ordering);

        // Special conditions
        if (filters.show === "offers") params.append("discount", "1");
        if (filters.show === "new") params.append("ordering", "-created_at");

        const url = `/products/?${params.toString()}`;
        const res = await axiosClient.get(url);

        setProducts(
          Array.isArray(res.data.results) ? res.data.results : []
        );

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

  // -------------------------
  // ⭐ FETCH CATEGORIES FOR SIDEBAR
  // -------------------------
 

  // -------------------------
  // ⭐ APPLY FILTERS → UPDATE URL
  // -------------------------
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
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">All Products</h1>

      <div className="grid grid-cols-12 gap-6">

        {/* Filters Sidebar */}
        <div className="col-span-12 md:col-span-3">
          <Filters
            categories={categories}
            currentFilters={filters}
            applyFilters={applyFilters}
          />
        </div>

        {/* Products Section */}
        <div className="col-span-12 md:col-span-9">
          {loading ? (
            <p className="text-center text-lg">Loading...</p>
          ) : products.length === 0 ? (
            <p className="text-center">No products found.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
