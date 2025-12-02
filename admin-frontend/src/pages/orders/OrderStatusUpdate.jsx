import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getOrderDetails, updateOrderStatus } from "../../api/adminApi";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";

const STATUS_OPTIONS = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const PAYMENT_STATUS = [
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
];

export default function OrderStatusUpdate() {
  const { orderNumber } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await getOrderDetails(orderNumber);
        setOrder(res.data);
        setStatus(res.data.status);
        setPaymentStatus(res.data.payment_status);
      } catch (e) {
        console.error(e);
        setErr("Unable to fetch order.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [orderNumber]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateOrderStatus(orderNumber, {
        status,
        payment_status: paymentStatus,
      });

      navigate(`/orders/${orderNumber}`);
    } catch (e) {
      console.error(e);
      setErr("Failed to update order.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !order) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-50">
            Update Order Status
          </h1>
          <p className="text-xs text-slate-400">Order: {order.order_number}</p>
        </div>

        <Button variant="outline" onClick={() => navigate(`/orders/${orderNumber}`)}>
          Back
        </Button>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-3 text-xs text-slate-300">

          {/* Order Status */}
          <div className="space-y-1">
            <label className="text-slate-200">Order Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-2 py-2 outline-none"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Payment Status */}
          <div className="space-y-1">
            <label className="text-slate-200">Payment Status</label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-2 py-2 outline-none"
            >
              {PAYMENT_STATUS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {err && <p className="text-red-400 text-xs sm:col-span-2">{err}</p>}

          <div className="sm:col-span-2 flex justify-end gap-2">
            <Button variant="ghost" type="button" onClick={() => navigate(`/orders/${orderNumber}`)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Update"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
