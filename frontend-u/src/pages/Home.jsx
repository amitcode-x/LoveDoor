import { lazy, Suspense, useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

// Animation + Loader
import Loader from "../components/home/Loader";
import AnimateOnScroll from "../components/home/AnimateOnScroll";

// ==========================
// LAZY IMPORTS
// ==========================
const StaticHero = lazy(() => import("../components/home/StaticHero"));
const MainHeroSlider = lazy(() => import("../components/home/MainHeroSlider"));
const CategorySection = lazy(() =>
  import("../components/home/CategorySection")
);
const PopularProducts = lazy(() =>
  import("../components/home/PopularProducts")
);
const FeaturedOffers = lazy(() => import("../components/home/FeaturedOffers"));
const SecondaryHero = lazy(() => import("../components/home/SecondaryHero"));
const NewArrivals = lazy(() => import("../components/home/NewArrivals"));
const GiftOffer = lazy(() => import("../components/home/GiftOffer"));
const RecentAndTopProducts = lazy(() =>
  import("../components/home/RecentAndTopProducts")
);
const ServiceFeatures = lazy(() =>
  import("../components/home/ServiceFeatures")
);
const FooterSection = lazy(() => import("../components/home/FooterSection"));

// ========================
// 🎨 PRODUCT SKELETON LOADER
// ========================
const ProductSkeleton = ({ count = 4 }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {[...Array(count)].map((_, idx) => (
      <div
        key={idx}
        className="bg-white/40 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/30 animate-pulse"
      >
        {/* Image Skeleton */}
        <div className="w-full aspect-square bg-gradient-to-br from-pink-200/50 to-orange-200/50 rounded-xl mb-3"></div>
        
        {/* Title Skeleton */}
        <div className="h-4 bg-gradient-to-r from-pink-200/50 to-orange-200/50 rounded-full mb-2"></div>
        <div className="h-4 bg-gradient-to-r from-pink-200/50 to-orange-200/50 rounded-full mb-3 w-3/4"></div>
        
        {/* Rating Skeleton */}
        <div className="flex items-center gap-2 mb-3">
          <div className="h-3 bg-gradient-to-r from-pink-200/50 to-orange-200/50 rounded-full w-20"></div>
          <div className="h-3 bg-gradient-to-r from-pink-200/50 to-orange-200/50 rounded-full w-8"></div>
        </div>
        
        {/* Price Skeleton */}
        <div className="h-5 bg-gradient-to-r from-pink-200/50 to-orange-200/50 rounded-full mb-3 w-1/2"></div>
        
        {/* Button Skeleton */}
        <div className="h-9 bg-gradient-to-r from-pink-200/50 to-orange-200/50 rounded-lg w-full"></div>
      </div>
    ))}
  </div>
);

// ========================
// 🎨 CATEGORY SKELETON LOADER
// ========================
const CategorySkeleton = () => (
  <div className="flex gap-4 overflow-hidden">
    {[...Array(6)].map((_, idx) => (
      <div
        key={idx}
        className="flex-shrink-0 bg-white/40 backdrop-blur-xl rounded-2xl p-4 min-w-[120px] shadow-xl border border-white/30 animate-pulse"
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-200/50 to-orange-200/50 mx-auto mb-2"></div>
        <div className="h-3 bg-gradient-to-r from-pink-200/50 to-orange-200/50 rounded-full"></div>
      </div>
    ))}
  </div>
);

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [popular, setPopular] = useState([]);
  const [newest, setNewest] = useState([]);
  const [homeConfig, setHomeConfig] = useState(null);
  
  // ⭐ Loading states
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // ========================
  // 1️⃣ FETCH HOMEPAGE CONFIG
  // ========================
  useEffect(() => {
    axiosClient
      .get("/homepage/")
      .then((res) => setHomeConfig(res.data))
      .catch((err) => console.log("Homepage config error:", err));
  }, []);

  // ========================
  // 2️⃣ FETCH CATEGORIES + PRODUCTS
  // ========================
  useEffect(() => {
    async function fetchData() {
      try {
        // ⭐ Categories loading
        setLoadingCategories(true);
        const catRes = await axiosClient.get("/products/categories/");
        setCategories(
          Array.isArray(catRes.data?.results)
            ? catRes.data.results
            : Array.isArray(catRes.data)
            ? catRes.data
            : []
        );
        setLoadingCategories(false);

        // ⭐ Products loading
        setLoadingProducts(true);
        const [popRes, newRes] = await Promise.all([
          axiosClient.get("/products/?featured=true"),
          axiosClient.get("/products/?ordering=-created_at"),
        ]);

        setPopular(
          Array.isArray(popRes.data?.results)
            ? popRes.data.results
            : Array.isArray(popRes.data)
            ? popRes.data
            : []
        );

        setNewest(
          Array.isArray(newRes.data?.results)
            ? newRes.data.results
            : Array.isArray(newRes.data)
            ? newRes.data
            : []
        );
        setLoadingProducts(false);
      } catch (err) {
        console.error("Homepage data fetch error:", err);
        setLoadingCategories(false);
        setLoadingProducts(false);
      }
    }

    fetchData();
  }, []);

  // Safety slices
  const recent = Array.isArray(newest) ? newest.slice(0, 3) : [];
  const top = Array.isArray(popular) ? popular.slice(0, 3) : [];

  return (
    <div className="min-h-screen md:py-10 bg-gradient-to-br from-gray-50 via-white to-gray-100">

      {/* 1️⃣ Static Hero */}
      <Suspense fallback={<Loader />}>
        <AnimateOnScroll>
          <StaticHero data={homeConfig?.static_hero} />
        </AnimateOnScroll>
      </Suspense>

      {/* 2️⃣ Main Slider */}
      <Suspense fallback={<Loader />}>
        <AnimateOnScroll>
          <MainHeroSlider slides={homeConfig?.hero_slides || []} />
        </AnimateOnScroll>
      </Suspense>

      {/* 3️⃣ Categories */}
      <Suspense fallback={<Loader />}>
        <AnimateOnScroll>
          <section className="w-full px-3 sm:px-4 md:px-6 py-4 md:py-6">
            <div className="max-w-7xl mx-auto">
              {loadingCategories ? (
                <CategorySkeleton />
              ) : (
                <CategorySection categories={categories} />
              )}
            </div>
          </section>
        </AnimateOnScroll>
      </Suspense>

      {/* 4️⃣ Popular Products */}
      <Suspense fallback={<Loader />}>
        <AnimateOnScroll>
          <section className="w-full px-3 sm:px-4 md:px-6 py-4 md:py-6">
            <div className="max-w-7xl mx-auto">
              {loadingProducts ? (
                <ProductSkeleton count={4} />
              ) : (
                <PopularProducts products={popular} />
              )}
            </div>
          </section>
        </AnimateOnScroll>
      </Suspense>

      {/* 5️⃣ Featured Offers */}
      <Suspense fallback={<Loader />}>
        <AnimateOnScroll>
          <section className="w-full px-3 sm:px-4 md:px-6 py-4 md:py-6">
            <div className="max-w-7xl mx-auto">
              <FeaturedOffers offers={homeConfig?.featured_offers || []} />
            </div>
          </section>
        </AnimateOnScroll>
      </Suspense>

      {/* 6️⃣ Secondary Hero */}
      <Suspense fallback={<Loader />}>
        <AnimateOnScroll>
          <SecondaryHero data={homeConfig?.secondary_hero} />
        </AnimateOnScroll>
      </Suspense>

      {/* 7️⃣ New Arrivals */}
      <Suspense fallback={<Loader />}>
        <AnimateOnScroll>
          <section className="w-full px-3 sm:px-4 md:px-6 py-4 md:py-6 ">
            <div className="max-w-7xl mx-auto">
              {loadingProducts ? (
                <ProductSkeleton count={4} />
              ) : (
                <NewArrivals products={newest} />
              )}
            </div>
          </section>
        </AnimateOnScroll>
      </Suspense>

      {/* 8️⃣ Gift Offer */}
      <Suspense fallback={<Loader />}>
        <AnimateOnScroll>
          <section className="w-full px-3 sm:px-4 md:px-6 py-4 md:py-6">
            <div className="max-w-7xl mx-auto">
              <GiftOffer data={homeConfig?.gift_offer} />
            </div>
          </section>
        </AnimateOnScroll>
      </Suspense>

      {/* 9️⃣ Recent + Top Products */}
      <Suspense fallback={<Loader />}>
        <AnimateOnScroll>
          <section className="w-full px-3 sm:px-4 md:px-6 py-4 md:py-6 ">
            <div className="max-w-7xl mx-auto">
              {loadingProducts ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProductSkeleton count={3} />
                  <ProductSkeleton count={3} />
                </div>
              ) : (
                <RecentAndTopProducts recent={recent} top={top} />
              )}
            </div>
          </section>
        </AnimateOnScroll>
      </Suspense>

      {/* 🔟 Services */}
      <Suspense fallback={<Loader />}>
        <AnimateOnScroll>
          <section className="w-full px-3 sm:px-4 md:px-6 py-4 md:py-6 ">
            <div className="max-w-7xl mx-auto">
              <ServiceFeatures features={homeConfig?.service_features || []} />
            </div>
          </section>
        </AnimateOnScroll>
      </Suspense>

      {/* 1️⃣1️⃣ Footer */}
      <Suspense fallback={<Loader />}>
        <FooterSection />
      </Suspense>
    </div>
  );
}