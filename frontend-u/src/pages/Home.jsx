import { lazy, Suspense, useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

// Loader + Animation
import Loader from "../components/home/Loader";
import AnimateOnScroll from "../components/home/AnimateOnScroll";

// ==========================
// 🔥 ABOVE THE FOLD (EAGER)
// ==========================
import StaticHero from "../components/home/StaticHero";
import MainHeroSlider from "../components/home/MainHeroSlider";

// ==========================
// ⚡ LAZY LOADED SECTIONS
// ==========================
const CategorySection = lazy(() =>
  import("../components/home/CategorySection")
);
const PopularProducts = lazy(() =>
  import("../components/home/PopularProducts")
);
const FeaturedOffers = lazy(() =>
  import("../components/home/FeaturedOffers")
);
const SecondaryHero = lazy(() =>
  import("../components/home/SecondaryHero")
);
const NewArrivals = lazy(() =>
  import("../components/home/NewArrivals")
);
const GiftOffer = lazy(() =>
  import("../components/home/GiftOffer")
);
const RecentAndTopProducts = lazy(() =>
  import("../components/home/RecentAndTopProducts")
);
const ServiceFeatures = lazy(() =>
  import("../components/home/ServiceFeatures")
);
const FooterSection = lazy(() =>
  import("../components/home/FooterSection")
);

// ========================
// PRODUCT SKELETON
// ========================
const ProductSkeleton = ({ count = 4 }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {[...Array(count)].map((_, idx) => (
      <div
        key={idx}
        className="bg-white/40 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/30 animate-pulse"
      >
        <div className="w-full aspect-square bg-gradient-to-br from-pink-200/50 to-orange-200/50 rounded-xl mb-3"></div>
        <div className="h-4 bg-gradient-to-r from-pink-200/50 to-orange-200/50 rounded-full mb-2"></div>
        <div className="h-4 bg-gradient-to-r from-pink-200/50 to-orange-200/50 rounded-full mb-3 w-3/4"></div>
        <div className="h-5 bg-gradient-to-r from-pink-200/50 to-orange-200/50 rounded-full w-1/2"></div>
      </div>
    ))}
  </div>
);

// ========================
// CATEGORY SKELETON
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

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // ========================
  // FETCH HOMEPAGE CONFIG
  // ========================
  useEffect(() => {
    axiosClient
      .get("/homepage/")
      .then((res) => setHomeConfig(res.data))
      .catch(() => {});
  }, []);

  // ========================
  // FETCH PRODUCTS + CATEGORIES
  // ========================
  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        setLoadingCategories(true);
        const catRes = await axiosClient.get("/products/categories/");
        if (mounted) {
          setCategories(catRes.data?.results || []);
          setLoadingCategories(false);
        }

        setLoadingProducts(true);
        const [popRes, newRes] = await Promise.all([
          axiosClient.get("/products/?featured=true"),
          axiosClient.get("/products/?ordering=-created_at"),
        ]);

        if (mounted) {
          setPopular(popRes.data?.results || []);
          setNewest(newRes.data?.results || []);
          setLoadingProducts(false);
        }
      } catch {
        setLoadingCategories(false);
        setLoadingProducts(false);
      }
    }

    fetchData();
    return () => (mounted = false);
  }, []);

  const recent = newest.slice(0, 3);
  const top = popular.slice(0, 3);

  return (
    <div className="min-h-screen md:py-10 bg-gradient-to-br from-gray-50 via-white to-gray-100">

      {/* 🔥 HERO (FAST FIRST PAINT) */}
      <AnimateOnScroll>
        <StaticHero data={homeConfig?.static_hero} />
      </AnimateOnScroll>

      <AnimateOnScroll>
        <MainHeroSlider slides={homeConfig?.hero_slides || []} />
      </AnimateOnScroll>

      {/* ⚡ ALL LAZY SECTIONS */}
      <Suspense fallback={<Loader />}>
        <AnimateOnScroll>
          <section className="px-4 py-6 max-w-7xl mx-auto">
            {loadingCategories ? (
              <CategorySkeleton />
            ) : (
              <CategorySection categories={categories} />
            )}
          </section>

          <section className="px-4 py-6 max-w-7xl mx-auto">
            {loadingProducts ? (
              <ProductSkeleton />
            ) : (
              <PopularProducts products={popular} />
            )}
          </section>

          <section className="px-4 py-6 max-w-7xl mx-auto">
            <FeaturedOffers offers={homeConfig?.featured_offers || []} />
          </section>

          <SecondaryHero data={homeConfig?.secondary_hero} />

          <section className="px-4 py-6 max-w-7xl mx-auto">
            {loadingProducts ? (
              <ProductSkeleton />
            ) : (
              <NewArrivals products={newest} />
            )}
          </section>

          <section className="px-4 py-6 max-w-7xl mx-auto">
            <GiftOffer data={homeConfig?.gift_offer} />
          </section>

          <section className="px-4 py-6 max-w-7xl mx-auto">
            {loadingProducts ? (
              <ProductSkeleton count={3} />
            ) : (
              <RecentAndTopProducts recent={recent} top={top} />
            )}
          </section>

          <section className="px-4 py-6 max-w-7xl mx-auto">
            <ServiceFeatures features={homeConfig?.service_features || []} />
          </section>

          <FooterSection />
        </AnimateOnScroll>
      </Suspense>
    </div>
  );
}
