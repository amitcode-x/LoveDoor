import { useEffect, useState, useMemo } from "react";
import axiosClient from "../api/axiosClient";
import { Link, useNavigate } from "react-router-dom";
import { FileText, XCircle, Search, Package, Clock, CheckCircle } from "lucide-react";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [cancelLoadingId, setCancelLoadingId] = useState(null);
  const [productThumbs, setProductThumbs] = useState({});
  const navigate = useNavigate();

  const steps = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];

  const getStepIndex = (status) => {
    const idx = steps.indexOf(status);
    return idx === -1 ? 0 : idx;
  };

  const fetchOrders = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await axiosClient.get(`/orders/?page=${pageNumber}`);
      if (Array.isArray(res.data)) {
        setOrders(res.data);
        setHasNext(false);
        setHasPrev(false);
      } else {
        const list = res.data.results || [];
        setOrders(list);
        setHasNext(Boolean(res.data.next));
        setHasPrev(Boolean(res.data.previous));
      }
    } catch (e) {
      setOrders([]);
      setHasNext(false);
      setHasPrev(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  // thumbnails
  useEffect(() => {
    const fetchThumbnails = async () => {
      if (!orders || orders.length === 0) return;

      const currentMap = { ...productThumbs };
      const needed = [];

      orders.forEach((order) => {
        order.items?.forEach((item) => {
          if (!currentMap[item.product]) {
            needed.push({
              id: item.product,
              name: item.product_name,
            });
          }
        });
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

    fetchThumbnails();
  }, [orders]);

  const handleCancel = async (order) => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this order?\nThis cannot be undone."
      )
    ) {
      return;
    }

    setCancelLoadingId(order.id);
    try {
      const res = await axiosClient.post(
        `/orders/cancel/${order.order_number}/`
      );
      const updated = res.data.order;
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? updated : o))
      );
    } catch (e) {
      alert(
        e.response?.data?.error || "Failed to cancel order. Please try again."
      );
    }
    setCancelLoadingId(null);
  };

  const handleInvoice = (order) => {
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

  const filteredOrders = useMemo(() => {
    if (!searchTerm.trim()) return orders;
    const term = searchTerm.toLowerCase();

    return orders.filter((o) => {
      if (o.order_number.toLowerCase().includes(term)) return true;
      if (
        o.items?.some((item) =>
          item.product_name.toLowerCase().includes(term)
        )
      )
        return true;
      return false;
    });
  }, [orders, searchTerm]);

  if (loading)
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
                Loading your orders...
              </p>
            </div>
          </div>
        </div>
      </div>
    );

  if (!Array.isArray(orders) || orders.length === 0)
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-pink-100/60 to-orange-100/60"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-300/40 to-orange-300/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-red-300/50 to-yellow-300/50 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
          <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-12 shadow-2xl border border-white/30 text-center max-w-md">
            <Package className="w-20 h-20 mx-auto mb-4 text-gray-400" />
            <p className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
              No Orders Yet
            </p>
            <p className="text-gray-600 mt-2">Start shopping to see your orders here!</p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-pink-100/60 to-orange-100/60"></div>
      
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-300/40 to-orange-300/50 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-red-300/50 to-yellow-300/50 rounded-full blur-3xl"></div>
      
      {/* Content */}
      <div className="relative z-10 p-4 sm:p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-2">
            My Orders
          </h1>
          <p className="text-sm text-gray-600">Track and manage your purchases</p>
        </div>

        {/* Search & Page Info */}
        <div className="mb-6 bg-white/40 backdrop-blur-xl rounded-xl p-4 shadow-xl border border-white/30">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                className="w-full bg-white/60 backdrop-blur-sm border border-white/40 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all placeholder-gray-500"
                placeholder="Search by order or product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="px-3 py-1.5 bg-white/60 backdrop-blur-sm rounded-lg border border-white/40">
                Page {page}
              </span>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-5">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="group relative bg-white/40 backdrop-blur-xl rounded-2xl p-5 shadow-xl border border-white/30 hover:bg-white/50 hover:shadow-2xl hover:scale-[1.01] transition-all duration-300"
            >
              {/* Shine Effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none"></div>

              {/* Order Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-800 mb-1">
                    Order #{order.order_number}
                  </h2>

                  <p className="text-sm text-gray-600 mb-3">
                    Placed on: {new Date(order.created_at).toLocaleDateString()}
                  </p>

                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full text-white shadow-md ${
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

                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full text-white shadow-md ${
                        order.payment_status === "PAID"
                          ? "bg-gradient-to-r from-green-600 to-green-700"
                          : "bg-gradient-to-r from-red-500 to-red-600"
                      }`}
                    >
                      {order.payment_status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <Clock size={14} className="text-gray-500" />
                    <p className="text-xs text-gray-600">
                      ETA: <span className="font-semibold text-gray-800">{getETA(order.created_at)}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                    ₹{order.total_amount}
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="mb-4 space-y-3 bg-white/30 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                {order.items?.map((item) => {
                  const thumb = productThumbs[item.product];
                  return (
                    <div
                      key={item.id}
                      className="flex justify-between items-center py-2 border-b border-white/40 last:border-0"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/60 backdrop-blur-sm flex items-center justify-center shadow-md">
                          {thumb ? (
                            <img
                              src={thumb}
                              alt={item.product_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-bold text-gray-600">
                              {item.product_name.charAt(0)}
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 line-clamp-2">
                            {item.product_name}
                          </p>
                          <p className="text-xs text-gray-600">
                            ₹{item.product_price} × {item.quantity}
                          </p>
                        </div>
                      </div>

                      <div className="font-bold text-gray-800">₹{item.line_total}</div>
                    </div>
                  );
                })}
              </div>

              {/* Timeline */}
              <div className="mb-4 flex items-center no-scrollbar justify-between gap-1 overflow-x-auto pb-2">
                {steps.map((step, idx) => {
                  const active = idx <= getStepIndex(order.status);
                  return (
                    <div key={step} className="flex items-center gap-1 flex-shrink-0">
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                            active
                              ? "bg-gradient-to-r from-pink-500 to-red-500 shadow-lg"
                              : "bg-white/60 backdrop-blur-sm"
                          }`}
                        >
                          {active ? (
                            <CheckCircle size={16} className="text-white" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                          )}
                        </div>
                        <span
                          className={`text-xs font-medium ${
                            active ? "text-pink-600" : "text-gray-500"
                          }`}
                        >
                          {step}
                        </span>
                      </div>
                      {idx < steps.length - 1 && (
                        <div
                          className={`w-8 sm:w-12 h-1 rounded-full transition-all duration-300 ${
                            active ? "bg-gradient-to-r from-pink-400 to-red-400" : "bg-gray-300"
                          }`}
                        ></div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-2">
                <Link
                  to={`/order/${order.order_number}`}
                  className="flex-1 min-w-[140px] px-4 py-2.5 bg-gradient-to-r from-gray-700 to-gray-800 text-white text-sm font-semibold rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all shadow-md hover:shadow-lg text-center"
                >
                  View Details
                </Link>

                <button
                  className="flex-1 min-w-[140px] px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
                  onClick={() =>
                    navigate(
                      `/track-order?order=${order.order_number}&phone=${order.shipping_phone}`
                    )
                  }
                >
                  Track Order
                </button>

                <button
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white/70 backdrop-blur-sm border border-white/50 text-sm font-semibold rounded-lg hover:bg-white/90 transition-all shadow-md hover:shadow-lg text-gray-800"
                  onClick={() => handleInvoice(order)}
                >
                  <FileText size={16} /> Invoice
                </button>

                {(order.status === "PENDING" || order.status === "PROCESSING") && (
                  <button
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={cancelLoadingId === order.id}
                    onClick={() => handleCancel(order)}
                  >
                    <XCircle size={16} />
                    {cancelLoadingId === order.id ? "Cancelling..." : "Cancel"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {(hasNext || hasPrev) && (
          <div className="mt-6 flex justify-center gap-3">
            <button
              disabled={!hasPrev}
              onClick={() => hasPrev && setPage((p) => Math.max(1, p - 1))}
              className="px-6 py-2.5 text-sm font-semibold rounded-lg bg-white/60 backdrop-blur-sm border border-white/40 hover:bg-white/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md"
            >
              Previous
            </button>

            <button
              disabled={!hasNext}
              onClick={() => hasNext && setPage((p) => p + 1)}
              className="px-6 py-2.5 text-sm font-semibold rounded-lg bg-white/60 backdrop-blur-sm border border-white/40 hover:bg-white/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}