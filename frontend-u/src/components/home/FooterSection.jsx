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

  // SAFE FALLBACKS
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
      await axiosClient.post("/footer/subscribe/", { email });
      setMessage("🎉 Subscription successful! Please check your inbox.");
      setEmail("");
    } catch (err) {
      setMessage("Subscription failed. Try again!");
    }
  };

  return (
    <footer className="w-full bg-gray-900 text-gray-300 pt-14 rounded-t-3xl">

      {/* Newsletter Section */}
      {safeNewsletter?.is_enabled && (
        <div className="max-w-7xl mx-auto px-4 pb-10">
          <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl border border-gray-700 shadow-lg">

            <h3 className="text-2xl font-bold mb-2 text-white">
              {safeNewsletter?.title || "Get Updates"}
            </h3>

            <p className="text-gray-400 mb-6 max-w-xl">
              {safeNewsletter?.description || ""}
            </p>

            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-4 max-w-md"
            >
              <input
                type="email"
                required
                placeholder={safeNewsletter?.placeholder || "Enter your email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-5 py-3 rounded-full text-white flex-1 focus:outline-none shadow-md"
              />

              <button
                type="submit"
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                {safeNewsletter?.button_text || "Subscribe"}
              </button>
            </form>

            {message && <p className="text-sm mt-3 text-green-400">{message}</p>}
          </div>
        </div>
      )}

      {/* Footer Middle */}
      <div className="border-t border-gray-800 border-b">
        <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-10 text-sm">

          {/* Brand Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">
              {safeBrand?.site_name || "Brand"}
            </h4>

            <p className="text-gray-400 mb-4">
              {safeBrand?.description || ""}
            </p>

            <div className="flex items-center gap-4 mt-4">
              {socialLinks.map((s, i) => (
                <a key={i} href={s.url} target="_blank">
                  {s.platform === "facebook" && <FaFacebookF className="text-gray-400 hover:text-white cursor-pointer text-lg" />}
                  {s.platform === "instagram" && <FaInstagram className="text-gray-400 hover:text-white cursor-pointer text-lg" />}
                  {s.platform === "twitter" && <FaTwitter className="text-gray-400 hover:text-white cursor-pointer text-lg" />}
                  {s.platform === "linkedin" && <FaLinkedinIn className="text-gray-400 hover:text-white cursor-pointer text-lg" />}
                  {s.platform === "youtube" && <FaYoutube className="text-gray-400 hover:text-white cursor-pointer text-lg" />}
                </a>
              ))}
            </div>
          </div>

          {/* Dynamic Columns */}
          {columns.map((col) => (
            <div key={col.id}>
              <h4 className="font-semibold mb-4 text-white">{col.title}</h4>
              <ul className="space-y-2 text-gray-400">
                {Array.isArray(col.links) &&
                  col.links.map((lnk, idx) => (
                    <li key={idx}>
                      <Link
                        to={lnk.url}
                        target={lnk.open_in_new_tab ? "_blank" : "_self"}
                        className="hover:text-white"
                      >
                        {lnk.label}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}

          {/* Payment Methods */}
          <div>
            <h4 className="font-semibold mb-4 text-white">We Accept</h4>
            <div className="flex gap-3 flex-wrap">
              {payments.map((p, idx) => (
                <img
                  key={idx}
                  src={p.image}
                  className="max-w-xs object-contain bg-white p-1 rounded"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center py-6 text-xs text-gray-500">
        {safeBrand?.copyright_text}
        <br />
        {safeBrand?.owner_text}
      </div>

    </footer>
  );
}
