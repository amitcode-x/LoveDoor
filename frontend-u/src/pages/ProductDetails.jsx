import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { FiHeart, FiStar } from "react-icons/fi";
import ProductCard from "../components/ProductCard";
import ImageViewer from "../components/gallery/ImageViewer";

export default function ProductDetails() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [viewerOpen, setViewerOpen] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);

  const [reviewForm, setReviewForm] = useState({
    name: "",
    email: "",
    rating: 5,
    review_text: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");

  // ----------------------------------------------------
  // LOAD PRODUCT + REVIEWS
  // ----------------------------------------------------
  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await axiosClient.get(`/products/${slug}/`);
        setProduct(res.data);

        // RELATED PRODUCTS
        if (res.data?.category?.slug) {
          const r = await axiosClient.get(
            `/products/?category=${res.data.category.slug}`
          );
          setRelated(
            Array.isArray(r.data.results)
              ? r.data.results.filter((p) => p.id !== res.data.id)
              : []
          );
        }

        // REVIEWS (safe fetch)
        try {
          const rev = await axiosClient.get(`/products/${slug}/reviews/`);
          const list =
            Array.isArray(rev.data)
              ? rev.data
              : Array.isArray(rev.data.results)
              ? rev.data.results
              : [];

          setReviews(list);
        } catch (err) {
          console.warn("No reviews found.");
          setReviews([]);
        }
      } catch (err) {
        console.error("Product fetch failed", err);
      }
    }

    loadProduct();
  }, [slug]);

  if (!product) return <p className="p-6">Loading...</p>;

  const discount =
    product.discount_price > 0
      ? Math.round(
          ((product.price - product.discount_price) / product.price) * 100
        )
      : 0;

  const imagesArray =
    product.images?.length > 0
      ? product.images
      : [{ image_url: product.thumbnail }];

  const inWishlist = isInWishlist(product.id);

  const avgRating = product.average_rating || 0;
  const reviewCount = product.total_reviews || 0;

  // ----------------------------------------------------
  // SUBMIT REVIEW
  // ----------------------------------------------------
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError("");

    if (!reviewForm.name || !reviewForm.email || !reviewForm.rating) {
      setReviewError("Name, email और rating ज़रूरी हैं।");
      return;
    }

    try {
      setSubmitting(true);

      await axiosClient.post(`/products/${slug}/reviews/`, {
        name: reviewForm.name,
        email: reviewForm.email,
        rating: Number(reviewForm.rating),
        review_text: reviewForm.review_text,
      });

      // form reset
      setReviewForm({
        name: "",
        email: "",
        rating: 5,
        review_text: "",
      });

      // re-fetch product + reviews together
      const [revRes, prodRes] = await Promise.all([
        axiosClient.get(`/products/${slug}/reviews/`),
        axiosClient.get(`/products/${slug}/`),
      ]);

      const list =
        Array.isArray(revRes.data)
          ? revRes.data
          : Array.isArray(revRes.data.results)
          ? revRes.data.results
          : [];

      setReviews(list);
      setProduct(prodRes.data);
    } catch (err) {
      console.error("Review submit failed", err);
      setReviewError("Review submit नहीं हो पाया, बाद में try करें।");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Breadcrumb */}
      <p className="text-sm text-gray-600 mb-4">
        <Link to="/" className="text-blue-600">
          Home
        </Link>{" "}
        /{" "}
        <Link
          to={`/category/${product.category.slug}`}
          className="text-blue-600"
        >
          {product.category.name}
        </Link>{" "}
        / <span className="font-semibold">{product.name}</span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Image Gallery */}
        <div>
          <div
            className="w-full h-80 overflow-hidden rounded-lg shadow-sm cursor-pointer"
            onClick={() => {
              setImgIndex(0);
              setViewerOpen(true);
            }}
          >
            <img
              src={imagesArray[0].image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {imagesArray.length > 1 && (
            <div className="flex gap-3 mt-3 overflow-x-auto">
              {imagesArray.map((img, idx) => (
                <img
                  key={idx}
                  src={img.image_url}
                  onClick={() => {
                    setImgIndex(idx);
                    setViewerOpen(true);
                  }}
                  className="w-20 h-20 rounded border cursor-pointer hover:opacity-80 flex-shrink-0"
                />
              ))}
            </div>
          )}

          {/* Full Screen Viewer */}
          {viewerOpen && (
            <ImageViewer
              images={imagesArray}
              index={imgIndex}
              setIndex={setImgIndex}
              onClose={() => setViewerOpen(false)}
            />
          )}
        </div>

        {/* Right: Product Info */}
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center text-yellow-500">
              <FiStar className="mr-1" />
              <span className="font-semibold">
                {avgRating ? avgRating.toFixed(1) : "No rating"}
              </span>
            </div>
            {reviewCount > 0 && (
              <span className="text-gray-500 text-sm">
                ({reviewCount} reviews)
              </span>
            )}
          </div>

          {/* Price */}
          <div className="mt-4 flex items-center gap-3">
            <p className="text-3xl font-bold text-black">
              ₹{product.effective_price}
            </p>

            {discount > 0 && (
              <>
                <p className="text-gray-500 line-through text-lg">
                  ₹{product.price}
                </p>
                <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>

          {/* Stock */}
          <p className="mt-3 text-sm">
            {product.stock > 0 ? (
              <span className="text-green-600 font-semibold">In Stock</span>
            ) : (
              <span className="text-red-600 font-semibold">Out of Stock</span>
            )}
          </p>

          {/* Wishlist */}
          <button
            onClick={() => toggleWishlist(product)}
            className={`mt-4 inline-flex items-center gap-2 px-4 py-2 
            rounded-full border shadow-sm ${
              inWishlist
                ? "bg-red-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <FiHeart />
            {inWishlist ? "Wishlisted" : "Add to Wishlist"}
          </button>

          {/* Cart */}
          <button
            onClick={() => addToCart(product)}
            className="mt-4 ml-3 bg-black text-white px-6 py-2 rounded shadow-sm hover:bg-gray-900"
          >
            Add to Cart
          </button>

          {/* Description */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-600 leading-relaxed">
              {product.description || "No description available."}
            </p>
          </div>

          {/* Specifications */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Specifications</h2>
            <ul className="list-disc ml-6 text-gray-700">
              <li>Brand: {product.brand || "N/A"}</li>
              <li>Category: {product.category.name}</li>
              <li>SKU: #{product.id}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* USER REVIEWS */}
      <div className="mt-12 grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>

          {reviews.length === 0 ? (
            <p className="text-gray-500">
              कोई review नहीं है, पहले आप लिख सकते हैं 😊
            </p>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="border rounded-lg p-3 shadow-sm bg-white"
                >
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-semibold">{rev.name}</p>

                    <div className="flex items-center text-yellow-500 text-sm">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <FiStar key={i} className="mr-0.5" />
                      ))}
                      <span className="ml-1 text-gray-700">{rev.rating}/5</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 mb-1">
                    {new Date(rev.created_at).toLocaleString()}
                  </p>

                  {rev.review_text && (
                    <p className="text-gray-700 text-sm">{rev.review_text}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Review Form */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Write a Review</h2>

          {reviewError && (
            <p className="mb-2 text-sm text-red-600">{reviewError}</p>
          )}

          <form onSubmit={handleReviewSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={reviewForm.name}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input
                type="email"
                className="w-full border rounded px-3 py-2"
                value={reviewForm.email}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, email: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Rating (1–5) *
              </label>
              <select
                className="w-full border rounded px-3 py-2"
                value={reviewForm.rating}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, rating: e.target.value })
                }
                required
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r} Stars
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Review (optional)
              </label>
              <textarea
                className="w-full border rounded px-3 py-2"
                rows={4}
                value={reviewForm.review_text}
                onChange={(e) =>
                  setReviewForm({
                    ...reviewForm,
                    review_text: e.target.value,
                  })
                }
                placeholder="कुछ लिखना चाहो तो यहाँ लिखो 🙂"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-black text-white px-5 py-2 rounded hover:bg-gray-900 disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Related Products</h2>

        {related.length === 0 ? (
          <p>No related products found.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
