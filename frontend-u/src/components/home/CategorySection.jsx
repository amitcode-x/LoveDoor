import { Link } from "react-router-dom";
import {
  Laptop,
  Shirt,
  Home,
  Sparkles,
  Gift,
  BookOpen,
  Coffee,
  ShoppingBag,
  Watch,
  HeartHandshake,
} from "lucide-react";

// ⭐ Backend se agar relative URL aaye to full URL banao
const fixURL = (url) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `http://127.0.0.1:8000${url}`;
};

// ⭐ Auto Icon logic (name/slug ke hisaab se)
const getAutoIcon = (cat) => {
  const key = (cat.slug || cat.name || "").toLowerCase();

  if (key.includes("electronic") || key.includes("mobile") || key.includes("laptop"))
    return Laptop;

  if (key.includes("fashion") || key.includes("cloth") || key.includes("shirt"))
    return Shirt;

  if (key.includes("beauty") || key.includes("makeup") || key.includes("skin"))
    return Sparkles;

  if (key.includes("home") || key.includes("decor") || key.includes("kitchen"))
    return Home;

  if (key.includes("gift") || key.includes("valentine"))
    return Gift;

  if (key.includes("book"))
    return BookOpen;

  if (key.includes("coffee") || key.includes("mug") || key.includes("tea"))
    return Coffee;

  if (key.includes("watch") || key.includes("accessories"))
    return Watch;

  if (key.includes("love"))
    return HeartHandshake;

  // default generic icon
  return ShoppingBag;
};

// ⭐ MAIN PRIORITY FUNCTION
const getCategoryDisplay = (cat) => {
  // 1️⃣ category_image (highest priority)
  if (cat.category_image) {
    return {
      type: "image",
      value: fixURL(cat.category_image),
    };
  }

  // 2️⃣ category_image_url (2nd priority)
  if (cat.category_image_url) {
    return {
      type: "image",
      value: cat.category_image_url,
    };
  }

  // 3️⃣ category_icon (3rd priority)
  if (cat.category_icon) {
    return {
      type: "image",
      value: fixURL(cat.category_icon),
    };
  }

  // 4️⃣ Auto icon (4th priority – from lucide-react)
  const AutoIcon = getAutoIcon(cat);
  if (AutoIcon) {
    return {
      type: "icon",
      value: AutoIcon,
    };
  }

  // 5️⃣ Fallback → first letter
  return {
    type: "letter",
    value: (cat.name || "?")[0],
  };
};

export default function CategorySection({ categories }) {
  return (
    <section className="w-full px-4.5 pb-3">
      <div  className="max-w-8xl bg-gradient-to-r from-pink-100/60 via-red-100/60 to-red-100/90 rounded-2xl  mx-auto px-4 md:px-6 py-10">

        {/* ⭐ Heading */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-black">Shop by Category</h2>

          <Link
            to="/all-products"
            className="text-blue-400 text-sm font-medium hover:underline"
          >
            See All →
          </Link>
        </div>

        {/* ⭐ Scroll Row */}
        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => {
            const display = getCategoryDisplay(cat);

            return (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="bg-white min-w-[140px] rounded-xl shadow-sm border p-4 flex flex-col items-center hover:shadow-md transition"
              >
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-3">
                  {display.type === "image" ? (
                    <img
                      src={display.value}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                    />
                  ) : display.type === "icon" ? (
                    <display.value className="w-8 h-8 text-gray-700" />
                  ) : (
                    <span className="text-xl font-bold">
                      {display.value}
                    </span>
                  )}
                </div>

                <p className="font-medium">{cat.name}</p>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
