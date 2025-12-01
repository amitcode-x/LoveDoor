import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // FETCH RESULTS WHEN TYPING
  useEffect(() => {
    if (search.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const delay = setTimeout(() => {
      axiosClient
        .get(`/products/?search=${search}`)
        .then((res) => {
          setResults(res.data.results || res.data); 
          setShowDropdown(true);
        })
        .catch(() => setResults([]));
    }, 300); // debounce 300ms

    return () => clearTimeout(delay);
  }, [search]);

  return (
    <div className="relative w-full md:w-80">
      <FiSearch className="absolute left-3 top-3 text-gray-400" />
      <input
        type="text"
        placeholder="Search products..."
        className="border bg-gray-100 pl-10 pr-4 py-2 rounded-full w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => search.length > 1 && setShowDropdown(true)}
      />

      {/* DROPDOWN */}
      {showDropdown && results.length > 0 && (
        <div className="absolute mt-2 left-0 w-full bg-white shadow-lg border rounded-lg max-h-64 overflow-y-auto z-50">
          {results.map((item) => (
            <Link
              key={item.id}
              to={`/product/${item.slug}`}
              onClick={() => {
                setSearch("");
                setShowDropdown(false);
              }}
              className="block px-4 py-2 hover:bg-gray-100"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.thumbnail}
                  alt={item.name}
                  className="w-10 h-10 rounded object-cover"
                />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">₹{item.effective_price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* NO RESULTS */}
      {showDropdown && results.length === 0 && search.length >= 2 && (
        <div className="absolute mt-2 left-0 w-full bg-white shadow-lg border rounded-lg p-3 text-center text-gray-600">
          No products found
        </div>
      )}
    </div>
  );
}
