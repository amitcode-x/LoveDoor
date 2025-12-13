import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import { FileText, XCircle, Truck, History, Package, MapPin, CheckCircle, Clock, ArrowLeft } from "lucide-react";

export default function OrderDetails() {
  const { user } = useAuth();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [productThumbs, setProductThumbs] = useState({});

  const getVisibleSteps = () => {
    if (!order) return [];

    const isCancelled = order.status === "CANCELLED";
    const isRefunded = order.payment_status === "REFUNDED";

    if (!isCancelled && !isRefunded) {
      return ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];
    }

    if (isCancelled && !isRefunded) {
      return ["PENDING", "CONFIRMED", "CANCELLED"];
    }

    if (isRefunded) {
      return ["PENDING", "CONFIRMED", "CANCELLED", "REFUNDED"];
    }

    return [];
  };

  const steps = getVisibleSteps();

  const getStepIndex = (status) => {
    const idx = steps.indexOf(status);
    return idx === -1 ? 0 : idx;
  };

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    axiosClient
      .get(`/orders/${orderId}/`)
      .then((res) => {
        setOrder(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [orderId, user]);

  useEffect(() => {
    const fetchThumbs = async () => {
      if (!order || !order.items || order.items.length === 0) return;

      const currentMap = { ...productThumbs };
      const needed = [];

      order.items.forEach((item) => {
        if (!currentMap[item.product]) {
          needed.push({
            id: item.product,
            name: item.product_name,
          });
        }
      });

      for (const p of needed) {
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

    fetchThumbs();
  }, [order]);

  const handleCancel = async () => {
    if (!order) return;
    if (
      !window.confirm(
        "Are you sure you want to cancel this order?\nThis cannot be undone."
      )
    ) {
      return;
    }

    setCancelLoading(true);
    try {
      const res = await axiosClient.post(
        `/orders/cancel/${order.order_number}/`
      );
      setOrder(res.data.order);
    } catch (e) {
      alert(
        e.response?.data?.error || "Failed to cancel order. Please try again."
      );
    }
    setCancelLoading(false);
  };

  const handleInvoice = () => {
    if (!order) return;
    const BASE = axiosClient.defaults.baseURL;
    window.open(`${BASE}/orders/${order.order_number}/invoice/`, "_blank");
  };

  const getETA = (createdAt) => {
    if (!createdAt) return "3–5 days";
    const d = new Date(createdAt);
    const eta = new Date(d);
    eta.setDate(eta.getDate() + 4);
    return eta.toLocaleDateString();
  };

  if (!user) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-pink-100/60 to-orange-100/60"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-300/40 to-orange-300/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-red-300/50 to-yellow-300/50 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 bg-white/40 backdrop-blur-xl rounded-2xl p-12 shadow-2xl border border-white/30 text-center max-w-md">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-xl font-semibold text-gray-800 mb-4">
            Please{" "}
            <Link className="text-pink-600 underline hover:text-pink-700" to="/login">
              login
            </Link>{" "}
            to see order details.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-pink-100/60 to-orange-100/60"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-300/40 to-orange-300/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-red-300/50 to-yellow-300/50 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/30">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-pink-500 border-t-transparent"></div>
              <p className="text-lg font-semibold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                Loading order details...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-pink-100/60 to-orange-100/60"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-300/40 to-orange-300/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-red-300/50 to-yellow-300/50 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 bg-white/40 backdrop-blur-xl rounded-2xl p-12 shadow-2xl border border-white/30 text-center max-w-md">
          <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <p className="text-2xl font-bold text-red-600">Order not found!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-pink-100/60 to-orange-100/60"></div>
      
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-300/40 to-orange-300/50 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-red-300/50 to-yellow-300/50 rounded-full blur-3xl"></div>
      
      {/* Content */}
      <div className="relative z-10 p-4 sm:p-6 max-w-5xl mx-auto">
        {/* Back Button */}
        <Link 
          to="/my-orders" 
          className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-lg border border-white/40 hover:bg-white/80 transition-all shadow-md text-gray-700 font-medium"
        >
          <ArrowLeft size={18} />
          Back to Orders
        </Link>

        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-2">
            Order #{order.order_number}
          </h1>
          <p className="text-sm text-gray-600">View complete order details</p>
        </div>

        {/* Summary Card */}
        <div className="mb-6 bg-white/40 backdrop-blur-xl rounded-2xl p-5 shadow-xl border border-white/30 hover:shadow-2xl transition-all">
          <div className="flex flex-col lg:flex-row justify-between gap-5">
            <div className="flex-1 space-y-3">
              {/* Status & Payment */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">Status:</span>
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full text-white shadow-md ${
                      order.status === "DELIVERED"
                        ? "bg-gradient-to-r from-green-500 to-green-600"
                        : order.status === "SHIPPED"
                        ? "bg-gradient-to-r from-blue-500 to-blue-600"
                        : order.status === "PROCESSING"
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                        : order.status === "CANCELLED"
                        ? "bg-gradient-to-r from-red-500 to-red-600"
                        : "bg-gradient-to-r from-gray-500 to-gray-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">Payment:</span>
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full text-white shadow-md ${
                      order.payment_status === "PAID"
                        ? "bg-gradient-to-r from-green-600 to-green-700"
                        : "bg-gradient-to-r from-red-500 to-red-600"
                    }`}
                  >
                    {order.payment_status}
                  </span>
                </div>
              </div>

              {/* Amount & Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 border border-white/40">
                  <p className="text-xs text-gray-600 mb-1">Total Amount</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                    ₹{order.total_amount}
                  </p>
                </div>

                <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 border border-white/40">
                  <p className="text-xs text-gray-600 mb-1">Order Placed</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock size={12} className="text-gray-500" />
                    <p className="text-xs text-gray-600">
                      ETA: <span className="font-semibold">{getETA(order.created_at)}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 min-w-[180px]">
              <button
                onClick={handleInvoice}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/70 backdrop-blur-sm border border-white/50 rounded-lg text-sm font-semibold hover:bg-white/90 transition-all shadow-md hover:shadow-lg text-gray-800"
              >
                <FileText size={16} /> Download Invoice
              </button>

              {(order.status === "PENDING" || order.status === "PROCESSING") && (
                <button
                  onClick={handleCancel}
                  disabled={cancelLoading}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-sm font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <XCircle size={16} />
                  {cancelLoading ? "Cancelling..." : "Cancel Order"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Timeline Card */}
        <div className="mb-6 bg-white/40 backdrop-blur-xl rounded-2xl p-5 shadow-xl border border-white/30">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Truck className="text-pink-500" size={24} /> 
            Order Progress
          </h2>

          {/* Progress Bar & Steps */}
          <div className="relative mb-8">
            <div className="absolute top-5 left-0 w-full h-1 bg-gray-300 rounded"></div>
            <div
              className="absolute top-5 left-0 h-1 bg-gradient-to-r from-pink-500 to-red-500 rounded transition-all duration-500"
              style={{
                width: `${(getStepIndex(order.status) / (steps.length - 1)) * 100}%`,
              }}
            ></div>

            <div className="relative flex justify-between">
              {steps.map((step, idx) => {
                const active = idx <= getStepIndex(order.status);
                return (
                  <div key={step} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-full border-2 shadow-lg transition-all duration-300 ${
                        active
                          ? "bg-gradient-to-r from-pink-500 to-red-500 border-pink-500"
                          : "bg-white/70 backdrop-blur-sm border-gray-300"
                      }`}
                    >
                      {active ? (
                        <CheckCircle size={20} className="text-white" />
                      ) : (
                        <div className="w-2.5 h-2.5 bg-gray-400 rounded-full"></div>
                      )}
                    </div>

                    <span style={{fontSize:"11px"}}
                      className={` mt-2 font-medium text-center max-w-[80px] ${
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

          {/* Status History */}
          {Array.isArray(order.status_history) && order.status_history.length > 0 && (
            <div className="mt-6 bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/40">
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-3 text-gray-800">
                <History size={16} className="text-pink-500" /> Status History
              </h3>

              <div className="space-y-2">
                {order.status_history.map((h) => (
                  <div
                    key={h.id}
                    className="flex justify-between items-center text-xs bg-white/60 backdrop-blur-sm rounded-lg p-2 border border-white/30"
                  >
                    <span className="font-semibold text-gray-800">{h.status}</span>
                    <span className="text-gray-600">{new Date(h.created_at).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Shipping Address */}
        <div className="mb-6 bg-white/40 backdrop-blur-xl rounded-2xl p-5 shadow-xl border border-white/30">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="text-pink-500" size={24} /> 
            Shipping Address
          </h2>

          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/40 space-y-1">
            <p className="font-bold text-gray-800 text-lg">{order.shipping_full_name}</p>
            <p className="text-gray-700">{order.shipping_phone}</p>
            <p className="text-gray-700">{order.shipping_address_line1}</p>
            {order.shipping_address_line2 && <p className="text-gray-700">{order.shipping_address_line2}</p>}
            <p className="text-gray-700">
              {order.shipping_city}, {order.shipping_state} - {order.shipping_postal_code}
            </p>
            <p className="text-gray-700 font-semibold">{order.shipping_country}</p>
          </div>
        </div>

        {/* Items */}
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-5 shadow-xl border border-white/30">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Package className="text-pink-500" size={24} /> 
            Order Items
          </h2>

          <div className="space-y-3">
            {order.items.map((item) => {
              const thumb = productThumbs[item.product];
              return (
                <div
                  key={item.id}
                  className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-white/70 transition-all"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/70 backdrop-blur-sm flex items-center justify-center shadow-md flex-shrink-0">
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xl font-bold text-gray-600">
                          {item.product_name.charAt(0)}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-800 text-lg line-clamp-2 mb-1">{item.product_name}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                        <span>Price: <span className="font-semibold">₹{item.product_price}</span></span>
                        <span>Qty: <span className="font-semibold">{item.quantity}</span></span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-600 mb-1">Total</p>
                    <p className="text-xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                      ₹{item.line_total}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}