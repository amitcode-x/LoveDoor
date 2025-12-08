import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrders, markOrdersSeen } from "../../api/adminApi";

import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import { Table, THead, TBody, Tr, Th, Td } from "../../components/UI/Table";
import { Filter, Eye } from "lucide-react";

const STATUS_OPTIONS = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const navigate = useNavigate();

  async function loadOrders(filter = "") {
    try {
      setLoading(true);
      setErr("");
      const res = await getOrders(filter);
      setOrders(res.data || []);
    } catch (e) {
      console.error(e);
      setErr("Failed to load orders.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function init() {
      // 🔥 STEP 1: Mark all unseen orders as seen
      try {
        await markOrdersSeen();
        window.dispatchEvent(new Event("ordersSeen")); // sidebar count reset
      } catch (e) {
        console.log("Failed to mark orders as seen");
      }

      // 🔥 STEP 2: Load all orders
      loadOrders();
    }

    init();
  }, []);

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setStatusFilter(value);
    loadOrders(value);
  };

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-50">Orders</h1>
          <p className="text-xs text-slate-400">View and manage all customer orders.</p>
        </div>

        <Card className="flex items-center gap-2 px-3 py-1.5 rounded-xl">
          <Filter className="w-3 h-3 text-slate-500" />
          <select
            value={statusFilter}
            onChange={handleFilterChange}
            className="bg-transparent text-xs text-slate-100 outline-none"
          >
            <option value="">All Status</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </Card>
      </div>

      {/* Error */}
      {err && (
        <Card>
          <p className="text-sm text-red-400">{err}</p>
        </Card>
      )}

      {/* Table */}
      <Table>
        <THead>
          <Tr>
            <Th>Order #</Th>
            <Th>User</Th>
            <Th>Status</Th>
            <Th>Payment</Th>
            <Th>Total</Th>
            <Th>Date</Th>
            <Th align="right">Actions</Th>
          </Tr>
        </THead>

        <TBody>
          {/* Loading */}
          {loading && (
            <Tr>
              <Td colSpan={7} align="center" className="py-4">
                <div className="animate-spin h-7 w-7 border-2 border-emerald-500 border-t-transparent rounded-full" />
              </Td>
            </Tr>
          )}

          {/* No data */}
          {!loading && orders.length === 0 && (
            <Tr>
              <Td colSpan={7} align="center" className="py-4 text-slate-500">
                No orders found.
              </Td>
            </Tr>
          )}

          {/* Data */}
          {!loading &&
            orders.map((o) => (
              <Tr key={o.id}>
                <Td>
                  <div className="flex items-center gap-2">
                    <img
                      src={o.items?.[0]?.product_image}
                      className="w-10 h-10 rounded object-cover border border-slate-700"
                      alt=""
                    />
                    <span>{o.order_number}</span>
                  </div>
                </Td>

                <Td>{o.user?.username || "-"}</Td>
                <Td>
                  <span className="bg-slate-800 text-slate-200 px-2 py-0.5 text-[11px] rounded-full">
                    {o.status}
                  </span>
                </Td>
                <Td>{o.payment_status}</Td>
                <Td className="text-emerald-300 font-semibold">₹{o.total_amount}</Td>
                <Td>{new Date(o.created_at).toLocaleString()}</Td>

                <Td align="right">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/orders/${o.order_number}`)}
                  >
                    <Eye className="w-3 h-3 mr-1" /> View
                  </Button>
                </Td>
              </Tr>
            ))}
        </TBody>
      </Table>
    </div>
  );
}
