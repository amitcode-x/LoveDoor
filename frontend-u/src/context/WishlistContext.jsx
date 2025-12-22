import { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

// 🔑 localStorage key (safe)
const WISHLIST_KEY = "wishlist_cache";

export function WishlistProvider({ children }) {
  const { user } = useAuth();

  // ✅ Load initial wishlist from cache (INSTANT UI)
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const cached = localStorage.getItem(WISHLIST_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  // ⭐ Utility: always return pure array (SAFE)
  const normalize = (data) => {
    if (Array.isArray(data)) return data;
    if (data?.results && Array.isArray(data.results)) return data.results;
    return [];
  };

  // ✅ Sync wishlist to localStorage (NO BREAK)
  useEffect(() => {
    try {
      localStorage.setItem(
        WISHLIST_KEY,
        JSON.stringify(normalize(wishlistItems))
      );
    } catch {
      // ignore storage errors
    }
  }, [wishlistItems]);

  // ✅ Fetch wishlist from backend when user changes
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) {
        setWishlistItems([]);
        localStorage.removeItem(WISHLIST_KEY);
        return;
      }

      try {
        const res = await axiosClient.get("/wishlist/");
        setWishlistItems(normalize(res.data)); // server is source of truth
      } catch (err) {
        console.error("Failed to fetch wishlist", err);
        // ❗ UI still works from cache
      }
    };

    fetchWishlist();
  }, [user]);

  // ✅ Safe checker
  const isInWishlist = (productId) =>
    Array.isArray(wishlistItems) &&
    wishlistItems.some((item) => item?.product?.id === productId);

  // 🚀 OPTIMISTIC + SAFE toggle
  const toggleWishlist = async (product) => {
    if (!user) {
      alert("Please login to use wishlist.");
      return;
    }

    const alreadyInWishlist = isInWishlist(product.id);

    // ✅ 1. Instant UI update
    setWishlistItems((prev) => {
      if (alreadyInWishlist) {
        return prev.filter((item) => item?.product?.id !== product.id);
      } else {
        return [{ product }, ...prev];
      }
    });

    try {
      // ✅ 2. Backend sync (background)
      await axiosClient.post(`/wishlist/toggle/${product.id}/`);
    } catch (err) {
      console.error("Toggle wishlist failed", err);

      // 🔁 3. Rollback if API fails
      setWishlistItems((prev) => {
        if (alreadyInWishlist) {
          return [{ product }, ...prev];
        } else {
          return prev.filter((item) => item?.product?.id !== product.id);
        }
      });
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems: normalize(wishlistItems),
        isInWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
