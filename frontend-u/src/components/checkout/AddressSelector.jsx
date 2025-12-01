import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { Link } from "react-router-dom";

export default function AddressSelector({ selectedAddress, setSelectedAddress }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient.get("/auth/addresses/").then((res) => {
      setAddresses(res.data);

      // Fix: Always set first address as selected
      if (res.data.length > 0) {
        setSelectedAddress(res.data[0].id);
      }

      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading addresses...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Select Delivery Address</h2>

      {addresses.map((addr) => (
        <div
          key={addr.id}
          onClick={() => setSelectedAddress(addr.id)}
          className={`border p-4 rounded-lg cursor-pointer shadow-sm transition 
            ${selectedAddress === addr.id ? "border-black bg-gray-100" : "border-gray-300"}
          `}
        >
          <div className="flex items-start">
            <input
              type="radio"
              checked={selectedAddress === addr.id}
              onChange={() => setSelectedAddress(addr.id)}
              className="mt-1 mr-3"
            />

            <div>
              <p className="font-semibold text-lg">{addr.full_name}</p>
              <p>{addr.phone}</p>
              <p>{addr.address_line1}</p>
              {addr.address_line2 && <p>{addr.address_line2}</p>}
              <p>{addr.city}, {addr.state} - {addr.postal_code}</p>
            </div>
          </div>
        </div>
      ))}

      <Link
        to="/addresses"
        className="block bg-black text-white py-2 rounded text-center"
      >
        + Add New Address
      </Link>
    </div>
  );
}
