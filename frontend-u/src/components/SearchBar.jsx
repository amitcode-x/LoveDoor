import { useState, useEffect, useRef } from "react";
import axiosClient from "../api/axiosClient";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiX, FiClock, FiTrash2 } from "react-icons/fi";

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [history, setHistory] = useState([]);

  const containerRef = useRef(null);
  const navigate = useNavigate();

  // LOAD HISTORY
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("search_history") || "[]");
    setHistory(stored);
  }, []);

  const saveHistory = (query) => {
    if (!query.trim()) return;

    let updated = [query, ...history.filter((item) => item !== query)];
    updated = updated.slice(0, 10);
    setHistory(updated);
    localStorage.setItem("search_history", JSON.stringify(updated));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("search_history");
  };

  // CLICK OUTSIDE CLOSE
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // SEARCH API
  useEffect(() => {
    if (search.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const delay = setTimeout(() => {
      axiosClient
        .get(`/products/?search=${search}`)
        .then((res) => {
          setResults(res.data.results || res.data);
          setShowDropdown(true);
          setLoading(false);
        })
        .catch(() => {
          setResults([]);
          setLoading(false);
        });
    }, 300);

    return () => clearTimeout(delay);
  }, [search]);

  // KEYBOARD NAVIGATION
  const handleKeyDown = (e) => {
    if (!showDropdown || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    }

    if (e.key === "Enter" && activeIndex >= 0) {
      saveHistory(search);
      navigate(`/product/${results[activeIndex].slug}`);
      setShowDropdown(false);
      setSearch("");
    }

    if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  // SCROLL ACTIVE RESULT INTO VIEW
  useEffect(() => {
    if (activeIndex >= 0) {
      const el = document.getElementById(`result-item-${activeIndex}`);
      if (el) el.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  const clearSearch = () => {
    setSearch("");
    setResults([]);
    setShowDropdown(false);
    setActiveIndex(-1);
  };

  return (
    <>
      <style>{`
        .dropdown-enter { animation: dropdownFade 0.35s ease-out; }

        @keyframes dropdownFade {
          0% { opacity: 0; transform: translateY(-10px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        .glass-effect {
          backdrop-filter: blur(18px);
          background: rgba(255, 255, 255, 0.55);
        }

        .result-item { transition: 0.25s ease; }

        .result-item:hover {
          transform: translateX(4px);
          background: linear-gradient(90deg, #faf5ff, #fce7f3);
        }

        .active-result {
          background: rgba(243, 232, 255, 0.75) !important;
          border-left: 4px solid rgba(147, 51, 234, 0.55);
          box-shadow: 0 0 10px rgba(147, 51, 234, 0.18);
          transform: translateX(4px);
        }

        @media (max-width: 768px) {
          .mobile-search-button { display: flex; }
        }
        @media (min-width: 769px) {
          .mobile-search-button { display: none; }
        }
          
      `}</style>

      <div
        className="relative w-full"
        ref={containerRef}
        onKeyDown={handleKeyDown}
      >
        {/* scrollbar fix: overflow-x-hidden */}
        <div
          style={{
            boxShadow: "0 4px 12px rgba(0,0,0,0.10)",
            // background: "transparent",
            borderRadius: "12px",
          }}
          className="relative flex gap-2 overflow-x-hidden"
        >
          {/* SEARCH ICON INSIDE INPUT */}
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

          {/* INPUT */}
          <input
            type="text"
            placeholder="Search for anything"
            className="  py-3 rounded-xl w-full text-gray-800   placeholder-gray-400 border border-gray-300 focus:border-purple-500 focus:outline-none pl-10 pr-12"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setShowDropdown(true)}
          />

          {/* CLEAR BUTTON */}
          {search && (
            <button
              onClick={clearSearch}
              className="absolute right-14 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
            >
              <FiX className="w-5 h-5" />
            </button>
          )}

          {/* MOBILE SEARCH BUTTON */}
          <button
            className="mobile-search-button w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl items-center justify-center text-white shadow-md hover:scale-105 transition-all flex"
            onClick={() => {
              if (search.trim()) setShowDropdown(true);
            }}
          >
            <FiSearch className="w-5 h-5" />
          </button>
        </div>

        {/* 🔥 RECENT SEARCHES */}
        {showDropdown && search.length < 2 && history.length > 0 && (
          <div className="dropdown-enter glass-effect absolute mt-3 w-full shadow-xl rounded-2xl border border-white/30 max-h-80 overflow-y-auto overflow-x-hidden z-50">
            <div className="flex justify-between items-center p-3 border-b border-white/30">
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <FiClock /> Recent Searches
              </p>

              <button
                onClick={clearHistory}
                className="text-xs text-red-500 flex items-center gap-1 hover:text-red-700"
              >
                <FiTrash2 /> Clear
              </button>
            </div>

            {history.map((item, idx) => (
              <div
                key={idx}
                className="px-5 py-3 cursor-pointer flex items-center gap-3 hover:bg-purple-50 transition-all"
                onClick={() => {
                  setSearch(item);
                  setShowDropdown(true);
                }}
              >
                <FiClock className="text-purple-400" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        )}

        {/* SEARCH RESULTS */}
        {showDropdown && search.length >= 2 && results.length > 0 && (
          <div className="dropdown-enter glass-effect absolute mt-3 w-full shadow-xl border border-white/30 rounded-2xl max-h-96 overflow-y-auto overflow-x-hidden z-50">
            <div className="p-3 border-b border-white/30">
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Search Results ({results.length})
              </p>
            </div>

            {results.map((item, index) => (
              <Link
                key={item.id}
                id={`result-item-${index}`}
                to={`/product/${item.slug}`}
                className={`result-item block ${
                  activeIndex === index ? "active-result" : ""
                }`}
                onClick={() => {
                  saveHistory(search);
                  setShowDropdown(false);
                  setSearch("");
                }}
              >
                <div className="flex items-center gap-4 px-5 py-4 border-b border-white/20">
                  <img
                    src={item.thumbnail}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover shadow-md"
                  />

                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 mb-1 line-clamp-1">
                      {item.name}
                    </p>

                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold text-purple-600">
                        ₹{item.effective_price}
                      </p>

                      {item.price !== item.effective_price && (
                        <p className="text-sm text-gray-400 line-through">
                          ₹{item.price}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* NO RESULTS */}
        {showDropdown &&
          search.length >= 2 &&
          results.length === 0 &&
          !loading && (
            <div className="dropdown-enter glass-effect absolute mt-3 w-full shadow-xl border border-white/30 rounded-2xl p-8 text-center z-50">
              <FiSearch className="w-10 h-10 text-purple-400 mx-auto mb-3" />
              <p className="text-gray-700 font-medium mb-1">
                No products found
              </p>
              <p className="text-sm text-gray-500">Try different keywords</p>
            </div>
          )}
      </div>
    </>
  );
}
