import { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]); 

  // ⭐ Utility: always return pure array
  const normalize = (data) => {
    if (Array.isArray(data)) return data;
    if (data?.results && Array.isArray(data.results)) return data.results;
    return [];
  };

  // Load wishlist when user logs in/out
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) {
        setWishlistItems([]);
        return;
      }

      try {
        const res = await axiosClient.get("/wishlist/");
        setWishlistItems(normalize(res.data)); // ⭐ FIX
      } catch (err) {
        console.error("Failed to fetch wishlist", err);
      }
    };

    fetchWishlist();
  }, [user]);

  // ⭐ FIX: Prevent crash → use normalized array
const isInWishlist = (productId) =>
  Array.isArray(wishlistItems) &&
  wishlistItems.some((item) => item?.product?.id === productId);

const toggleWishlist = async (product) => {
  if (!user) {
    alert("Please login to use wishlist.");
    return;
  }

  try {
    const res = await axiosClient.post(`/wishlist/toggle/${product.id}/`);
    const { in_wishlist } = res.data;

    if (in_wishlist) {
      // ADD SAFELY
      setWishlistItems((prev) => [
        { product },
        ...prev.filter((i) => i?.product?.id !== product.id),
      ]);
    } else {
      // REMOVE SAFELY
      setWishlistItems((prev) =>
        prev.filter((item) => item?.product?.id !== product.id)
      );
    }

  } catch (err) {
    console.error("Toggle wishlist failed", err);
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
