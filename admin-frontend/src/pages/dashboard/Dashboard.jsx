import { useEffect, useState } from "react";
import { getDashboardStats } from "../../api/adminApi";
import Card from "../../components/UI/Card";
import RevenueChart from "../../components/charts/RevenueChart";
import { Users, ShoppingBag, Package, IndianRupee } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

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
    {
      label: "Total Revenue",
      value: `₹${stats.total_revenue || 0}`,
      icon: IndianRupee,
    },
    {
      label: "Total Orders",
      value: stats.total_orders || 0,
      icon: ShoppingBag,
    },
    {
      label: "Total Products",
      value: stats.total_products || 0,
      icon: Package,
    },
    {
      label: "Total Users",
      value: stats.total_users || 0,
      icon: Users,
    },
  ];

  const revenueData =
    stats.recent_orders?.map((o) => ({
      order: o.order_number,
      total: Number(o.total_amount),
    })) || [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-slate-50">
          Dashboard Overview
        </h1>
        <p className="text-xs text-slate-400">
          Store performance ka quick summary.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-400">{label}</div>
              <div className="text-sm font-semibold text-slate-50 mt-1">
                {value}
              </div>
            </div>
            <div className="h-8 w-8 rounded-2xl bg-emerald-500/15 flex items-center justify-center">
              <Icon className="w-4 h-4 text-emerald-400" />
            </div>
          </Card>
        ))}
      </div>

      {/* Chart + recent orders */}
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-sm font-semibold text-slate-50">
                Recent Orders Revenue
              </h2>
              <p className="text-[11px] text-slate-400">
                Last kuch orders ka amount.
              </p>
            </div>
          </div>
          <RevenueChart data={revenueData} />
        </Card>

        <Card>
          <h2 className="text-sm font-semibold text-slate-50 mb-2">
            Latest Orders
          </h2>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {stats.recent_orders?.length ? (
              stats.recent_orders.map((o) => (
                <div
                  key={o.id}
                  className="rounded-xl border border-slate-800/70 bg-slate-900/70 px-3 py-2 text-xs"
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
                    <span>{o.status}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-[11px] text-slate-500">
                No orders yet.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
