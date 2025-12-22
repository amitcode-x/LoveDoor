import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";

export default function FooterSection({ footer }) {
  if (!footer) return null;

  const safeBrand = footer.brand || {};
  const safeNewsletter = footer.newsletter || {};
  const socialLinks = Array.isArray(footer.social_links) ? footer.social_links : [];
  const columns = Array.isArray(footer.columns) ? footer.columns : [];
  const payments = Array.isArray(footer.payments) ? footer.payments : [];

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axiosClient.post("/footer/subscribe/", { email });
      if (res.status === 201) {
        setMessage("🎉 Subscription successful!");
        setEmail("");
      }
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message;

      if (status === 409 || msg === "This email is already subscribed.") {
        setMessage("Use another email — this one is already subscribed!");
        return;
      }
      if (status === 400) {
        setMessage("Please enter a valid email address!");
        return;
      }
      setMessage("Subscription failed. Try again!");
    }
  };

  return (
    <footer className="w-full relative overflow-hidden">
      {/* SAME GRADIENT */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-pink-100/50 to-orange-100/50"></div>

      {/* Decorative Glows */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-red-300/30 to-pink-300/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-orange-300/30 to-yellow-300/30 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-4 sm:py-6">

        {/* Newsletter */}
        {safeNewsletter?.is_enabled && (
          <div className="mb-6 flex justify-center px-2 sm:px-0">
            <div className="bg-white/50 backdrop-blur-xl p-4 sm:p-5 rounded-xl border border-white/50 shadow-xl max-w-md w-full text-center">
              <h3 className="text-lg sm:text-xl font-bold mb-1 bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                {safeNewsletter?.title || "Get Updates"}
              </h3>

              <p className="text-gray-600 text-xs sm:text-sm mb-3">
                {safeNewsletter?.description || ""}
              </p>

              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={safeNewsletter?.placeholder || "Enter your email"}
                  className="px-4 py-2 rounded-lg bg-white/80 text-gray-800 flex-1 focus:outline-none focus:ring-2 focus:ring-red-300 shadow-sm text-sm"
                />

                <button
                  type="submit"
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg text-sm"
                >
                  {safeNewsletter?.button_text || "Subscribe"}
                </button>
              </form>

              {message && (
                <p className="text-xs sm:text-sm mt-2 text-green-600 font-medium">
                  {message}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 mb-4 px-2 sm:px-0">

          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <h4 className="text-base sm:text-lg font-bold mb-2 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              {safeBrand?.site_name || "Brand"}
            </h4>

            <p className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-2">
              {safeBrand?.description || ""}
            </p>

            <div className="flex items-center gap-2 sm:gap-3">
              {socialLinks.map((s, i) => (
                <a
                  key={i}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center shadow-md"
                >
                  {s.platform === "facebook" && <FaFacebookF />}
                  {s.platform === "instagram" && <FaInstagram />}
                  {s.platform === "twitter" && <FaTwitter />}
                  {s.platform === "linkedin" && <FaLinkedinIn />}
                  {s.platform === "youtube" && <FaYoutube />}
                </a>
              ))}
            </div>
          </div>

          {/* Columns */}
          {columns.map((col) => (
            <div key={col.id}>
              <h4 className="text-sm sm:text-base font-bold mb-2 text-gray-800">
                {col.title}
              </h4>
              <ul className="space-y-1 text-gray-600">
                {Array.isArray(col.links) &&
                  col.links.map((lnk, idx) => (
                    <li key={idx}>
                      <Link
                        to={lnk.url}
                        target={lnk.open_in_new_tab ? "_blank" : "_self"}
                        className="text-xs sm:text-sm hover:text-red-500 transition-colors"
                      >
                        {lnk.label}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}

          {/* Payments */}
          {payments.length > 0 && (
            <div className="col-span-2 sm:col-span-3 lg:col-span-1">
              <h4 className="text-sm sm:text-base font-bold mb-2 text-gray-800">
                We Accept
              </h4>
              <div className="flex gap-2 flex-wrap">
                {payments.map((p, idx) => (
                  <img
                    key={idx}
                    src={p.image}
                    alt="Payment"
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                    className="h-6 sm:h-7 object-contain bg-white/60 backdrop-blur-sm p-1 rounded shadow-sm"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/40 pt-3 text-center px-2 sm:px-0">
          <p className="text-xs sm:text-sm text-gray-600">
            {safeBrand?.copyright_text}
          </p>
          {safeBrand?.owner_text && (
            <p className="text-xs text-gray-500 mt-1">
              {safeBrand?.owner_text}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
