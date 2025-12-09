import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import CategoryProductCard from "../components/CategoryProductCard";
import CategoryBanner from "../components/shop/CategoryBanner";

export default function CategoryPage() {
  const { slug } = useParams();

  const [loading, setLoading] = useState(true);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [products, setProducts] = useState([]);
  const [ordering, setOrdering] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function fetchCategory() {
      try {
        setLoading(true);

        const response = await axiosClient.get(
          `/products/?category=${slug}&ordering=${ordering}&page=${page}`
        );

        // ✅ Fix: products from results
        setProducts(Array.isArray(response.data.results) ? response.data.results : []);

        // ✅ Fix: category info from "category" root
        setCategoryInfo(response.data.category || null);

        setLoading(false);
      } catch (err) {
        console.error("Category fetch failed", err);
        setLoading(false);
      }
    }

    fetchCategory();
  }, [slug, ordering, page]);

  if (loading)
    return (
      <div className="w-full py-20 text-center text-xl font-semibold">
        Loading...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-15">

      {/* ⭐ CATEGORY BANNER — (MAIN FIX) */}
      {categoryInfo?.banner_image && (
        <CategoryBanner category={categoryInfo} />
      )}

      {/* Breadcrumb */}
      <p className="text-sm text-gray-500 mb-2">
        Home / Category /{" "}
        <span className="font-semibold">
          {categoryInfo?.name || slug.replaceAll("-", " ")}
        </span>
      </p>

      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6 capitalize">
        {categoryInfo?.name || slug.replaceAll("-", " ")}
      </h1>

      {/* Sorting */}
      <div className="flex justify-end mb-4">
        <select
          value={ordering}
          onChange={(e) => setOrdering(e.target.value)}
          className="border px-3 py-2 rounded-md"
        >
          <option value="">Sort By</option>
          <option value="price">Price: Low → High</option>
          <option value="-price">Price: High → Low</option>
          <option value="-created_at">Newest First</option>
          <option value="created_at">Oldest First</option>
        </select>
      </div>

      {/* Product Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {products.map((p) => (
            <CategoryProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-20 text-lg">
          No products found in this category.
        </p>
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
        >
          Prev
        </button>
        <button
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
