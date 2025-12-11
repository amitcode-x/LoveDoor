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

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [popular, setPopular] = useState([]);
  const [newest, setNewest] = useState([]);
  const [homeConfig, setHomeConfig] = useState(null);

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
        const [catRes, popRes, newRes] = await Promise.all([
          axiosClient.get("/products/categories/"),
          axiosClient.get("/products/?featured=true"),
          axiosClient.get("/products/?ordering=-created_at"),
        ]);

        // Handle paginated OR normal list
        setCategories(
          Array.isArray(catRes.data?.results)
            ? catRes.data.results
            : Array.isArray(catRes.data)
            ? catRes.data
            : []
        );

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
      } catch (err) {
        console.error("Homepage data fetch error:", err);
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
              <CategorySection categories={categories} />
            </div>
          </section>
        </AnimateOnScroll>
      </Suspense>

      {/* 4️⃣ Popular Products */}
      <Suspense fallback={<Loader />}>
        <AnimateOnScroll>
          <section className="w-full px-3 sm:px-4 md:px-6 py-4 md:py-6">
            <div className="max-w-7xl mx-auto">
              <PopularProducts products={popular} />
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
              <NewArrivals products={newest} />
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
              <RecentAndTopProducts recent={recent} top={top} />
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