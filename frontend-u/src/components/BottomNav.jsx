import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

import {
  Home,
  ShoppingBag,
  Sparkles,
  Lamp,
  Coffee,
  Gem,
  Briefcase,
  Gift,
  Circle,
} from "lucide-react";

// Fallback (always 9 only)
const fallbackCategories = [
  { name: "Home", path: "/" },
  { name: "Valentines Day Gifts", path: "/category/valentines-day-gifts" },
  { name: "Beauty", path: "/category/beauty" },
  { name: "Fashion", path: "/category/fashion" },
  { name: "Home Decor", path: "/category/home-decor" },
  { name: "Coffee Mugs", path: "/category/coffee-mugs" },
  { name: "Jewelry And Accessories", path: "/category/jewelry-accessories" },
  { name: "Wallets and Luggage", path: "/category/wallets-luggage" },
];

// Auto Icon Selector (very clean)
const getIconComponent = (name) => {
  if (!name) return Circle;

  const n = name.toLowerCase();

  if (n.includes("home")) return Home;
  if (n.includes("fashion")) return ShoppingBag;
  if (n.includes("beauty")) return Sparkles;
  if (n.includes("decor")) return Lamp;
  if (n.includes("mug") || n.includes("coffee")) return Coffee;
  if (n.includes("jewel")) return Gem;
  if (n.includes("wallet") || n.includes("luggage")) return Briefcase;
  if (n.includes("gift")) return Gift;

  return Circle;
};

export default function BottomNav() {
  const [categories, setCategories] = useState([]);
  const [isVisible, setIsVisible] = useState(true); 
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    axiosClient
      .get("/homepage/bottom-nav/")
      .then((res) => {
        const backendList = res.data?.results || [];

        let backendCats = backendList.map((c) => ({
          name: c.name,
          path: `/category/${c.slug}`,
          icon: getIconComponent(c.icon_name || c.name),
        }));

        let merged = [...backendCats];

        fallbackCategories.forEach((f) => {
          if (
            merged.length < 9 &&
            !merged.some((m) => m.name.toLowerCase() === f.name.toLowerCase())
          ) {
            merged.push({
              ...f,
              icon: getIconComponent(f.name),
            });
          }
        });

        merged = merged.slice(0, 9);

        setCategories(merged);
      })
      .catch(() => {
        setCategories(
          fallbackCategories.slice(0, 9).map((f) => ({
            ...f,
            icon: getIconComponent(f.name),
          }))
        );
      });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setIsVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }

      if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <style>{`
        .category-link {
          position: relative;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .category-link::before {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 50%;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #ec4899, #8b5cf6);
          transform: translateX(-50%);
          transition: width 0.3s ease;
        }

        .category-link:hover::before {
          width: 100%;
        }

        .category-link:hover {
          transform: translateY(-2px);
          color: #9333ea;
        }

        .category-link:hover .icon-wrapper {
          transform: scale(1.15) rotate(5deg);
          background: linear-gradient(135deg, #ec4899, #8b5cf6);
        }

        .icon-wrapper {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

.bottom-nav-container {
  transition: opacity 0.35s ease, transform 0.35s ease;
  will-change: opacity, transform;
}

.bottom-nav-container.nav-visible {
  opacity: 1;
  transform: translateY(0);
}

.bottom-nav-container.nav-hidden {
  opacity: 0;
  transform: translateY(-100%);
  pointer-events: none;
}
`}</style>

      <div
        className={`bottom-nav-container fixed left-0 h-14 w-full bg-white hidden md:block z-50 ${
          isVisible ? "nav-visible" : "nav-hidden"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 ">
          <div className="flex gap-8 justify-center items-center overflow-x-auto scrollbar-hide">
            {categories.map((c, i) => {
              const Icon = c.icon;
              return (
                <Link
                  key={i}
                  to={c.path}
                  className="category-link flex flex-col items-center gap-1 text-xs font-semibold text-gray-700 px-2 py-1 rounded-lg hover:bg-white/80 group min-w-fit"
                >
                  <div className="icon-wrapper w-7 h-7 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    <Icon
                      size={14}
                      className="text-purple-600 group-hover:text-white transition-colors"
                    />
                  </div>

                  {/* FIXED TEXT WRAP + CONSISTENT GAP */}
                  <span className="relative whitespace-normal leading-tight text-center text-[12px]  break-words">
                    {c.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
