import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "../../api/adminApi";
import Card from "../../components/UI/Card";
import RevenueChart from "../../components/charts/RevenueChart";
import { Users, ShoppingBag, Package, IndianRupee } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const res = await getDashboardStats();
        setStats(res.data);
      } catch (error) {
        console.error(error);
        setErr("Failed to load dashboard stats.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (err) {
    return (
      <Card>
        <div className="text-sm text-red-400">{err}</div>
      </Card>
    );
  }

  if (!stats) return null;

  const cards = [
    { label: "Total Revenue", value: `₹${stats.total_revenue || 0}`, icon: IndianRupee, onClick: null },
    { label: "Total Orders", value: stats.total_orders || 0, icon: ShoppingBag, onClick: () => navigate("/orders") },
    { label: "Total Products", value: stats.total_products || 0, icon: Package, onClick: () => navigate("/products") },
    { label: "Total Users", value: stats.total_users || 0, icon: Users, onClick: () => navigate("/users") },
  ];

  const revenueData =
    stats.recent_orders?.map((o) => ({
      order: o.order_number,
      total: Number(o.total_amount),
    })) || [];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="mb-1">
        <h1 className="text-xl font-bold text-slate-50 tracking-wide">
          Dashboard Overview
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Store performance ka quick summary.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, onClick }) => (
          <div
            key={label}
            onClick={onClick || undefined}
            className={`group cursor-pointer transition duration-200 ${
              onClick ? "hover:-translate-y-1" : ""
            }`}
          >
            <Card
              className="
                flex items-center justify-between p-4 
                bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900
                border border-slate-700/50 
                rounded-2xl 
                shadow-md shadow-black/40
                group-hover:border-emerald-400/40 
                group-hover:shadow-emerald-500/10
                transition-all
              "
            >
              <div>
                <div className="text-[11px] text-slate-400">{label}</div>
                <div className="text-lg font-semibold text-slate-50 mt-1">
                  {value}
                </div>
              </div>

              <div className="
                h-10 w-10 rounded-xl flex items-center justify-center 
                bg-emerald-500/15 border border-emerald-500/20 group-hover:scale-110 
                transition
              ">
                <Icon className="w-5 h-5 text-emerald-400" />
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Charts + Latest orders */}
      <div className="grid gap-4 xl:grid-cols-3">

        {/* Revenue Chart */}
        <Card
          className="
            xl:col-span-2 p-5 rounded-2xl 
            bg-slate-900/80 border border-slate-800/60 
            shadow-md shadow-black/30
          "
        >
          <h2 className="text-sm font-semibold text-slate-50 mb-1">
            Recent Orders Revenue
          </h2>
          <p className="text-[11px] text-slate-400 mb-3">
            Last kuch orders ka amount.
          </p>

          <div className="h-60">
            <RevenueChart data={revenueData} />
          </div>
        </Card>

        {/* Latest Orders */}
        <Card
          className="
            p-5 rounded-2xl 
            bg-slate-900/80 border border-slate-800/60 
            shadow-md shadow-black/30
          "
        >
          <h2 className="text-sm font-semibold text-slate-50 mb-3">
            Latest Orders
          </h2>

          {/* PURE TAILWIND — SCROLLBAR HIDDEN */}
          <div
            className="
              space-y-2 max-h-64 overflow-y-auto pr-1
              [&::-webkit-scrollbar]:hidden
              [-ms-overflow-style:'none']
              [scrollbar-width:'none']
            "
          >
            {stats.recent_orders?.length ? (
              stats.recent_orders.map((o) => (
                <div
                  key={o.id}
                  onClick={() => navigate(`/orders/${o.order_number}`)}
                  className="
                    rounded-xl border border-slate-800/70 
                    bg-slate-900/60 px-3 py-2 text-xs cursor-pointer 
                    hover:border-emerald-500/40 hover:bg-slate-800/60 
                    hover:shadow-md hover:shadow-emerald-500/10
                    transition
                  "
                >
                  <div className="flex justify-between gap-2">
                    <span className="font-medium text-slate-100">
                      {o.order_number}
                    </span>
                    <span className="text-emerald-300 font-semibold">
                      ₹{o.total_amount}
                    </span>
                  </div>

                  <div className="flex justify-between mt-1 text-[11px] text-slate-400">
                    <span>{o.user?.username || "User"}</span>
                    <span className="capitalize">{o.status}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-[11px] text-slate-500">No orders yet.</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
