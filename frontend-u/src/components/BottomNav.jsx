import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

// Professional Lucide Icons
import {
  Home,
  ShoppingBag,
  Sparkles,
  Lamp,
  Coffee,
  Gem,
  Briefcase,
  Gift,
  Circle
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

  useEffect(() => {
    axiosClient
      .get("/homepage/bottom-nav/")
      .then((res) => {
        const backendList = res.data?.results || [];

        // Convert backend result
        let backendCats = backendList.map((c) => ({
          name: c.name,
          path: `/category/${c.slug}`,
          icon: getIconComponent(c.icon_name || c.name),
        }));

        // Merge backend + fallback
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

        // Ensure only 9
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

  return (
    <div className="w-full bg-white border-t md:border-none">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-wrap gap-6 justify-center text-sm font-medium">
        {categories.map((c, i) => {
          const Icon = c.icon;
          return (
            <Link
              key={i}
              to={c.path}
              className="flex items-center gap-1 hover:text-red-500 transition"
            >
              <Icon size={16} />
              <span>{c.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
