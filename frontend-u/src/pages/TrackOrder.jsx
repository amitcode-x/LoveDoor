import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { Truck, CheckCircle, Box, Timer, History } from "lucide-react";

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [productThumbs, setProductThumbs] = useState({});

  const [params] = useSearchParams();

  const steps = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];

  const getStepIndex = (status) => {
    const idx = steps.indexOf(status);
    return idx === -1 ? 0 : idx;
  };

  // Autofill from query params: /track-order?order=...&phone=...
  useEffect(() => {
    const autoOrder = params.get("order");
    const autoPhone = params.get("phone");

    if (autoOrder) setOrderNumber(autoOrder);
    if (autoPhone) setPhone(autoPhone);
  }, [params]);

  const handleTrack = async () => {
    if (!orderNumber || !phone) {
      setError("Please enter both Order Number and Phone Number.");
      return;
    }

    setError("");
    setLoading(true);
    setOrder(null);
    setProductThumbs({});

    try {
      const res = await axiosClient.get(
        `/orders/track/?order_number=${orderNumber}&phone=${phone}`
      );
      setOrder(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong!");
    }

    setLoading(false);
  };

  // Fetch thumbnails for products in this order using product search
  useEffect(() => {
    const fetchThumbnails = async () => {
      if (!order || !order.items || order.items.length === 0) return;

      const currentMap = { ...productThumbs };
      const uniqueProducts = [];

      order.items.forEach((item) => {
        if (!currentMap[item.product]) {
          uniqueProducts.push({
            id: item.product,
            name: item.product_name,
          });
        }
      });

      for (const p of uniqueProducts) {
        try {
          const res = await axiosClient.get(
            `/products/?search=${encodeURIComponent(p.name)}`
          );
          const list = Array.isArray(res.data)
            ? res.data
            : res.data.results || [];
          const found = list.find((prod) => prod.id === p.id) || list[0];
          if (found && found.thumbnail) {
            currentMap[p.id] = found.thumbnail;
          }
        } catch (e) {
          // ignore error for thumbnail
        }
      }

      setProductThumbs(currentMap);
    };

    fetchThumbnails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  const getETA = (createdAt) => {
    if (!createdAt) return "Within 3–5 days";
    const d = new Date(createdAt);
    const eta = new Date(d);
    eta.setDate(eta.getDate() + 4);
    return eta.toLocaleDateString();
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Track Your Order</h1>

      {/* Input Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-5 rounded-xl shadow-lg space-y-4 border border-gray-200"
      >
        <input
          type="text"
          className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500"
          placeholder="Enter Order Number"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
        />

        <input
          type="text"
          className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500"
          placeholder="Enter Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <motion.button
          whileTap={{ scale: 0.95 }}
          className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 shadow-md"
          onClick={handleTrack}
        >
          Track Order
        </motion.button>

        {error && <p className="text-red-600 font-semibold">{error}</p>}
      </motion.div>

      {loading && (
        <p className="mt-6 text-center text-lg font-semibold animate-pulse">
          Checking Order...
        </p>
      )}

      {/* Order Result */}
      {order && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-white p-6 rounded-xl shadow-xl border border-gray-200"
        >
          <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
            <Box size={24} /> Order #{order.order_number}
          </h2>

          {/* Quick Info */}
          <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-4">
            <p className="text-lg font-semibold text-blue-700 flex items-center gap-2">
              <Timer /> Estimated Delivery:
            </p>
            <p className="text-blue-900 font-bold mt-1">
              {getETA(order.created_at)}
            </p>
          </div>

          <p className="text-lg">
            <strong>Status: </strong>{" "}
            <span className="text-blue-600 font-semibold">{order.status}</span>
          </p>

          <p className="text-lg">
            <strong>Total Amount:</strong> ₹{order.total_amount}
          </p>

          <p className="text-gray-500">
            Placed on: {new Date(order.created_at).toLocaleDateString()}
          </p>

          {/* === TIMELINE AREA === */}
          <div className="mt-8">
            <h3 className="font-semibold mb-3 text-lg">Order Progress</h3>

            <div className="relative">
              {/* BASE LINE */}
              <div className="absolute top-3 left-0 w-full h-1 bg-gray-300 rounded"></div>

              {/* PROGRESS GLOW LINE */}
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${
                    (getStepIndex(order.status) / (steps.length - 1)) * 100
                  }%`,
                }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute top-3 left-0 h-1 bg-blue-600 rounded shadow-[0_0_12px_3px_rgba(59,130,246,0.8)]"
              ></motion.div>

              {/* MOVING TRUCK */}
              <motion.div
                className="absolute -top-4"
                initial={{ x: 0 }}
                animate={{
                  x: `${
                    (getStepIndex(order.status) / (steps.length - 1)) * 100
                  }%`,
                }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                <Truck size={32} className="text-blue-600 drop-shadow-lg" />
              </motion.div>

              {/* STEPS */}
              <div className="flex justify-between mt-6">
                {steps.map((step, index) => {
                  const active = index <= getStepIndex(order.status);
                  return (
                    <div key={step} className="flex flex-col items-center">
                      <motion.div
                        animate={{
                          scale: active ? 1.2 : 1,
                          boxShadow: active
                            ? "0px 0px 15px rgba(59,130,246,0.9)"
                            : "none",
                        }}
                        className={`w-7 h-7 flex items-center justify-center rounded-full border-2 transition-all ${
                          active
                            ? "bg-blue-600 border-blue-600"
                            : "bg-gray-300 border-gray-400"
                        }`}
                      >
                        <CheckCircle
                          size={16}
                          className={active ? "text-white" : "text-gray-600"}
                        />
                      </motion.div>

                      <span
                        className={`text-sm mt-2 ${
                          active
                            ? "font-semibold text-blue-600"
                            : "text-gray-500"
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Items */}
          <h3 className="text-xl font-semibold mt-8 mb-2">Items</h3>
          {order.items.map((item) => {
            const thumb = productThumbs[item.product];
            return (
              <div
                key={item.id}
                className="border-b py-3 flex justify-between items-center text-gray-800"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-gray-500">
                        {item.product_name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{item.product_name}</p>
                    <p>
                      ₹{item.product_price} × {item.quantity}
                    </p>
                  </div>
                </div>

                <p className="font-bold">₹{item.line_total}</p>
              </div>
            );
          })}

          {/* Shipping Address */}
          <h3 className="text-xl font-semibold mt-8 mb-2">Shipping Address</h3>
          <p className="text-gray-700">
            {order.shipping_full_name}, {order.shipping_phone}
          </p>
          <p className="text-gray-700">
            {order.shipping_address_line1} {order.shipping_address_line2}
          </p>
          <p className="text-gray-700">
            {order.shipping_city}, {order.shipping_state} –{" "}
            {order.shipping_postal_code}
          </p>
          <p className="text-gray-700">{order.shipping_country}</p>

          {/* Status history (if available) */}
          {Array.isArray(order.status_history) &&
            order.status_history.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                  <History size={18} /> Status History
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  {order.status_history.map((h) => (
                    <div key={h.id} className="flex justify-between">
                      <span>{h.status}</span>
                      <span>
                        {new Date(h.created_at).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </motion.div>
      )}
    </div>
  );
}
