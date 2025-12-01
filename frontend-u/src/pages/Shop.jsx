import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import ProductCard from "../components/ProductCard";
import { useSearchParams } from "react-router-dom";
import CategoryBanner from "../components/shop/CategoryBanner";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category"); // ⭐ Category slug

  const [categoryInfo, setCategoryInfo] = useState(null); // ⭐ Banner + details

  // ============================
  // Load Products
  // ============================
  useEffect(() => {
    async function fetchProducts() {
      try {
        const url = category
          ? `/products/?category=${category}`
          : "/products/";

        const res = await axiosClient.get(url);

        // ⭐ SAFE extraction
        const list =
          Array.isArray(res.data)
            ? res.data
            : Array.isArray(res.data.results)
            ? res.data.results
            : [];

        setProducts(list);

        // ⭐ Category info also comes from backend
        if (res.data.category) {
          setCategoryInfo(res.data.category);
        } else {
          setCategoryInfo(null);
        }
      } catch (error) {
        console.error("Shop fetch error:", error);
      }
    }

    fetchProducts();
  }, [category]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      
      {/* ⭐ CATEGORY BANNER */}
      {categoryInfo && (
        <CategoryBanner
          title={categoryInfo.name}
          description={categoryInfo.description}
          image={categoryInfo.banner_image}
        />
      )}

      <h1 className="text-2xl font-bold mb-4">
        {categoryInfo
          ? `Category: ${categoryInfo.name}`
          : "Shop"}
      </h1>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}
    </div>
  );
}
