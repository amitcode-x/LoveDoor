import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { Heart, Star, ShoppingCart, Package, ChevronRight, Truck, Shield, RotateCcw, Sparkles } from "lucide-react";
import ProductCard from "../components/ProductCard";
import ImageViewer from "../components/gallery/ImageViewer";

export default function ProductDetails() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [viewerOpen, setViewerOpen] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [selectedImg, setSelectedImg] = useState(0);

  const [reviewForm, setReviewForm] = useState({
    name: "",
    email: "",
    rating: 5,
    review_text: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");

  // Load Product + Reviews
  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const res = await axiosClient.get(`/products/${slug}/`);
        setProduct(res.data);

        // Parallel fetch for faster loading
        const promises = [];
        
        // Related Products
        if (res.data?.category?.slug) {
          promises.push(
            axiosClient.get(`/products/?category=${res.data.category.slug}`)
              .then(r => {
                setRelated(
                  Array.isArray(r.data.results)
                    ? r.data.results.filter((p) => p.id !== res.data.id)
                    : []
                );
              })
              .catch(() => setRelated([]))
          );
        }

        // Reviews
        promises.push(
          axiosClient.get(`/products/${slug}/reviews/`)
            .then(rev => {
              const list = Array.isArray(rev.data)
                ? rev.data
                : Array.isArray(rev.data.results)
                ? rev.data.results
                : [];
              setReviews(list);
            })
            .catch(() => setReviews([]))
        );

        await Promise.all(promises);
      } catch (err) {
        console.error("Product fetch failed", err);
      }
      setLoading(false);
    }

    loadProduct();
  }, [slug]);

  // Submit Review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError("");

    if (!reviewForm.name || !reviewForm.email || !reviewForm.rating) {
      setReviewError("Name, email and rating are required.");
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

      setReviewForm({ name: "", email: "", rating: 5, review_text: "" });

      const [revRes, prodRes] = await Promise.all([
        axiosClient.get(`/products/${slug}/reviews/`),
        axiosClient.get(`/products/${slug}/`),
      ]);

      const list = Array.isArray(revRes.data)
        ? revRes.data
        : Array.isArray(revRes.data.results)
        ? revRes.data.results
        : [];

      setReviews(list);
      setProduct(prodRes.data);
    } catch (err) {
      setReviewError("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Loading Skeleton
  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-pink-100/60 to-orange-100/60"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-300/40 to-orange-300/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-red-300/50 to-yellow-300/50 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Skeleton */}
            <div className="space-y-4">
              <div className="w-full aspect-square bg-white/40 backdrop-blur-xl rounded-2xl border border-white/30 animate-pulse"></div>
              <div className="flex gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-20 h-20 bg-white/40 backdrop-blur-xl rounded-lg border border-white/30 animate-pulse"></div>
                ))}
              </div>
            </div>

            {/* Info Skeleton */}
            <div className="space-y-4">
              <div className="h-10 bg-white/40 backdrop-blur-xl rounded-lg border border-white/30 animate-pulse w-3/4"></div>
              <div className="h-6 bg-white/40 backdrop-blur-xl rounded-lg border border-white/30 animate-pulse w-1/2"></div>
              <div className="h-12 bg-white/40 backdrop-blur-xl rounded-lg border border-white/30 animate-pulse w-1/3"></div>
              <div className="h-40 bg-white/40 backdrop-blur-xl rounded-lg border border-white/30 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const discount = product.discount_price > 0
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;

  const imagesArray = product.images?.length > 0
    ? product.images
    : [{ image_url: product.thumbnail }];

  const inWishlist = isInWishlist(product.id);
  const avgRating = product.average_rating || 0;
  const reviewCount = product.total_reviews || 0;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-pink-100/60 to-orange-100/60"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-300/40 to-orange-300/50 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-red-300/50 to-yellow-300/50 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm flex-wrap">
          <Link to="/" className="text-pink-600 hover:text-pink-700 font-medium">
            Home
          </Link>
          <ChevronRight size={16} className="text-gray-400" />
          <Link to={`/category/${product.category.slug}`} className="text-pink-600 hover:text-pink-700 font-medium">
            {product.category.name}
          </Link>
          <ChevronRight size={16} className="text-gray-400" />
          <span className="text-gray-700 font-semibold truncate max-w-xs">{product.name}</span>
        </div>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="group relative bg-white/40 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/30 overflow-hidden">
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none"></div>
              
              <div
                className="relative w-full aspect-square rounded-xl overflow-hidden cursor-pointer bg-white/30"
                onClick={() => { setImgIndex(selectedImg); setViewerOpen(true); }}
              >
                <img
                  src={imagesArray[selectedImg].image_url}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                {discount > 0 && (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                    <Sparkles size={14} />
                    {discount}% OFF
                  </div>
                )}
              </div>
            </div>

            {imagesArray.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {imagesArray.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImg(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                      selectedImg === idx
                        ? "border-pink-500 shadow-lg scale-105"
                        : "border-white/40 hover:border-pink-300"
                    } bg-white/40 backdrop-blur-sm`}
                  >
                    <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info - IMPROVED */}
          <div className="space-y-5">
            <div className="group bg-gradient-to-br from-white/50 via-white/40 to-pink-50/30 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/40 relative overflow-hidden">
              {/* Shine Effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-transparent via-white/30 to-transparent pointer-events-none"></div>
              
              {/* Subtle Glow */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-300/20 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                {/* Product Name - BIGGER */}
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                  {product.name}
                </h1>

                {/* Rating - BIGGER */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-xl shadow-lg">
                    <Star size={20} fill="currentColor" />
                    <span className="ml-2 font-bold text-lg">{avgRating ? avgRating.toFixed(1) : "0.0"}</span>
                  </div>
                  {reviewCount > 0 && (
                    <span className="text-sm text-gray-600 font-medium">({reviewCount} reviews)</span>
                  )}
                </div>

                {/* Price - BIGGER & BOLDER */}
                <div className="flex items-center gap-4 mb-5">
                  <span className="text-5xl font-black bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                    ₹{product.effective_price}
                  </span>
                  {discount > 0 && (
                    <span className="text-2xl text-gray-500 line-through font-semibold">₹{product.price}</span>
                  )}
                </div>

                {/* Stock Badge */}
                {product.stock > 0 ? (
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-6 shadow-md">
                    <Package size={18} />
                    In Stock - Hurry Up!
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-400 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-6 shadow-md">
                    <Package size={18} />
                    Out of Stock
                  </div>
                )}

                {/* Action Buttons - BIGGER */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <button
                    onClick={() => addToCart(product)}
                    className="flex-1 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-pink-600 hover:via-red-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-2xl flex items-center justify-center gap-3 active:scale-95"
                  >
                    <ShoppingCart size={24} />
                    Add to Cart
                  </button>

                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`px-6 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 active:scale-95 ${
                      inWishlist
                        ? "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                        : "bg-white/70 backdrop-blur-sm border-2 border-white/50 text-gray-800 hover:bg-white/90"
                    }`}
                  >
                    <Heart size={24} fill={inWishlist ? "currentColor" : "none"} />
                  </button>
                </div>

                {/* Feature Icons */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center border border-white/50 hover:bg-white/80 transition-all">
                    <Truck size={28} className="mx-auto mb-2 text-pink-500" />
                    <p className="text-xs font-bold text-gray-800">Free Delivery</p>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center border border-white/50 hover:bg-white/80 transition-all">
                    <Shield size={28} className="mx-auto mb-2 text-pink-500" />
                    <p className="text-xs font-bold text-gray-800">Secure Payment</p>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center border border-white/50 hover:bg-white/80 transition-all">
                    <RotateCcw size={28} className="mx-auto mb-2 text-pink-500" />
                    <p className="text-xs font-bold text-gray-800">Easy Returns</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30">
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Sparkles size={20} className="text-pink-500" />
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed text-base">
                {product.description || "No description available."}
              </p>
            </div>

            {/* Specifications */}
            <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Specifications</h2>
              <div className="space-y-3">
                <div className="flex justify-between py-3 border-b border-white/40">
                  <span className="text-gray-600 font-medium">Brand</span>
                  <span className="font-bold text-gray-800">{product.brand || "N/A"}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/40">
                  <span className="text-gray-600 font-medium">Category</span>
                  <span className="font-bold text-gray-800">{product.category.name}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-gray-600 font-medium">SKU</span>
                  <span className="font-bold text-gray-800">#{product.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Customer Reviews */}
          <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Customer Reviews</h2>

            {reviews.length === 0 ? (
              <p className="text-gray-600">No reviews yet. Be the first to review! 😊</p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {reviews.map((rev) => (
                  <div key={rev.id} className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/40">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-bold text-gray-800">{rev.name}</p>
                      <div className="flex items-center bg-yellow-400/80 text-white px-2 py-1 rounded text-xs font-bold">
                        <Star size={12} fill="currentColor" className="mr-1" />
                        {rev.rating}/5
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                      {new Date(rev.created_at).toLocaleDateString()}
                    </p>
                    {rev.review_text && (
                      <p className="text-gray-700 text-sm">{rev.review_text}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Write Review */}
          <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Write a Review</h2>

            {reviewError && (
              <div className="mb-4 bg-red-100/80 backdrop-blur-sm border border-red-300 text-red-700 px-4 py-3 rounded-xl text-sm">
                {reviewError}
              </div>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  className="w-full bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all placeholder-gray-400"
                  placeholder="Your full name"
                  value={reviewForm.name}
                  onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  className="w-full bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all placeholder-gray-400"
                  placeholder="your@email.com"
                  value={reviewForm.email}
                  onChange={(e) => setReviewForm({ ...reviewForm, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Rating *</label>
                <select
                  className="w-full bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all"
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
                  required
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>{r} Stars</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Review</label>
                <textarea
                  className="w-full bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all placeholder-gray-400"
                  rows={4}
                  placeholder="Share your experience with this product..."
                  value={reviewForm.review_text}
                  onChange={(e) => setReviewForm({ ...reviewForm, review_text: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-xl font-bold hover:from-pink-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Viewer */}
      {viewerOpen && (
        <ImageViewer
          images={imagesArray}
          index={imgIndex}
          setIndex={setImgIndex}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </div>
  );
}