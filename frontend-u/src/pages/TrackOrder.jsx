import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { useSearchParams } from "react-router-dom";
import { Truck, CheckCircle, Box, Timer, History, MapPin, Package, Search } from "lucide-react";

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
        } catch (e) {}
      }

      setProductThumbs(currentMap);
    };

    fetchThumbnails();
  }, [order]);

  const getETA = (createdAt) => {
    if (!createdAt) return "Within 3–5 days";
    const d = new Date(createdAt);
    const eta = new Date(d);
    eta.setDate(eta.getDate() + 4);
    return eta.toLocaleDateString();
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-pink-100/60 to-orange-100/60"></div>
      
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-300/40 to-orange-300/50 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-red-300/50 to-yellow-300/50 rounded-full blur-3xl"></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto p-4 sm:p-6 py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-2">
            Track Your Order
          </h1>
          <p className="text-sm text-gray-600">Enter your order details to track delivery status</p>
        </div>

        {/* Input Card */}
        <div className="group mb-8 bg-white/40 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30 hover:shadow-2xl transition-all">
          {/* Shine Effect */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none"></div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Order Number
              </label>
              <input
                type="text"
                className="w-full bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl px-4 py-3 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all placeholder-gray-500"
                placeholder="Enter your order number"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="text"
                className="w-full bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl px-4 py-3 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all placeholder-gray-500"
                placeholder="Enter registered phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <button
              className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-3 rounded-xl font-bold hover:from-pink-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 active:scale-95"
              onClick={handleTrack}
            >
              <Search size={20} />
              Track Order
            </button>

            {error && (
              <div className="bg-red-100/80 backdrop-blur-sm border border-red-300 text-red-700 px-4 py-3 rounded-xl text-sm font-semibold">
                {error}
              </div>
            )}
          </div>
        </div>

        {loading && (
          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-white/40 backdrop-blur-xl rounded-2xl px-8 py-4 shadow-xl border border-white/30">
              <div className="animate-spin rounded-full h-6 w-6 border-4 border-pink-500 border-t-transparent"></div>
              <p className="text-lg font-semibold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                Checking Order...
              </p>
            </div>
          </div>
        )}

        {/* Order Result */}
        {order && (
          <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
            {/* Order Header */}
            <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Box className="text-pink-500" size={28} /> 
                Order #{order.order_number}
              </h2>

              {/* ETA Banner */}
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm p-4 rounded-xl border border-blue-300/40 mb-4">
                <p className="text-sm font-semibold text-blue-700 flex items-center gap-2 mb-1">
                  <Timer size={18} /> Estimated Delivery
                </p>
                <p className="text-xl font-bold text-blue-900">
                  {getETA(order.created_at)}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 border border-white/40">
                  <p className="text-xs text-gray-600 mb-1">Status</p>
                  <p className="font-bold text-lg bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
                    {order.status}
                  </p>
                </div>

                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 border border-white/40">
                  <p className="text-xs text-gray-600 mb-1">Total Amount</p>
                  <p className="font-bold text-lg text-gray-800">
                    ₹{order.total_amount}
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mt-3">
                Placed on: {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>

            {/* Timeline */}
            <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-gray-800">
                <Truck className="text-pink-500" size={24} />
                Order Progress
              </h3>

              <div className="relative pb-8">
                {/* Base Line */}
                <div className="absolute top-5 left-0 w-full h-1 bg-gray-300 rounded"></div>

                {/* Progress Line with Glow */}
                <div
                  className="absolute top-5 left-0 h-1 bg-gradient-to-r from-pink-500 to-red-500 rounded transition-all duration-1000 shadow-lg"
                  style={{
                    width: `${(getStepIndex(order.status) / (steps.length - 1)) * 100}%`,
                    boxShadow: '0 0 12px 3px rgba(236, 72, 153, 0.6)',
                  }}
                ></div>

                {/* Animated Truck */}
                <div
                  className="absolute -top-4 transition-all duration-1000 ease-out"
                  style={{
                    left: `calc(${(getStepIndex(order.status) / (steps.length - 1)) * 100}% - 16px)`,
                  }}
                >
                  <Truck size={32} className="text-pink-600 drop-shadow-lg animate-bounce" />
                </div>

                {/* Steps */}
                <div className="flex justify-between pt-12">
                  {steps.map((step, index) => {
                    const active = index <= getStepIndex(order.status);
                    return (
                      <div key={step} className="flex flex-col items-center flex-1">
                        <div
                          className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-500 ${
                            active
                              ? "bg-gradient-to-r from-pink-500 to-red-500 border-pink-500 shadow-lg scale-110"
                              : "bg-white/70 backdrop-blur-sm border-gray-300"
                          }`}
                          style={active ? { boxShadow: '0 0 15px rgba(236, 72, 153, 0.8)' } : {}}
                        >
                          <CheckCircle
                            size={20}
                            className={active ? "text-white" : "text-gray-400"}
                          />
                        </div>

                        <span
                          className={`text-xs mt-2 font-medium text-center ${
                            active ? "text-pink-600" : "text-gray-500"
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
            <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
                <Package className="text-pink-500" size={22} />
                Order Items
              </h3>

              <div className="space-y-3">
                {order.items.map((item) => {
                  const thumb = productThumbs[item.product];
                  return (
                    <div
                      key={item.id}
                      className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/40 flex justify-between items-center hover:bg-white/70 transition-all"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-white/70 backdrop-blur-sm flex items-center justify-center shadow-md flex-shrink-0">
                          {thumb ? (
                            <img
                              src={thumb}
                              alt={item.product_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-lg font-bold text-gray-600">
                              {item.product_name.charAt(0)}
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800">{item.product_name}</p>
                          <p className="text-sm text-gray-600">
                            ₹{item.product_price} × {item.quantity}
                          </p>
                        </div>
                      </div>

                      <p className="font-bold text-gray-800">₹{item.line_total}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
                <MapPin className="text-pink-500" size={22} />
                Shipping Address
              </h3>

              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/40 space-y-1 text-gray-700">
                <p className="font-bold text-gray-800">
                  {order.shipping_full_name}, {order.shipping_phone}
                </p>
                <p>
                  {order.shipping_address_line1} {order.shipping_address_line2}
                </p>
                <p>
                  {order.shipping_city}, {order.shipping_state} – {order.shipping_postal_code}
                </p>
                <p className="font-semibold">{order.shipping_country}</p>
              </div>
            </div>

            {/* Status History */}
            {Array.isArray(order.status_history) && order.status_history.length > 0 && (
              <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
                  <History className="text-pink-500" size={22} />
                  Status History
                </h3>

                <div className="space-y-2">
                  {order.status_history.map((h) => (
                    <div
                      key={h.id}
                      className="flex justify-between items-center text-sm bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/30"
                    >
                      <span className="font-semibold text-gray-800">{h.status}</span>
                      <span className="text-gray-600">
                        {new Date(h.created_at).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}