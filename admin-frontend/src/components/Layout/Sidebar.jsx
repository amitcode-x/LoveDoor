import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Shapes,
  Users,
  CreditCard,
  Home,
  Link2,
  Mail,
  Phone,
  FileText, // ⭐ Contact icon added
  RotateCcw,
   Truck,
   Undo2
} from "lucide-react";

const menuItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/orders", label: "Orders", icon: ShoppingBag },
  { to: "/products", label: "Products", icon: Package },

  // MAIN PRODUCT CATEGORIES
  { to: "/categories", label: "Categories", icon: Shapes },

  // HOMEPAGE
  { to: "/homepage", label: "Homepage", icon: Home },
  { to: "/homepage/static-hero", label: "Static Hero", icon: Home },
    { to: "/admin/homepage/hero-slides", label: "Hero Slides", icon: Home },


  // **BOTTOM NAV CATEGORIES (NEW)**
 { to: "/bottom-nav", label: "Bottom Nav Categories", icon: Shapes },


  { to: "/users", label: "Users", icon: Users },
  { to: "/payments", label: "Payments", icon: CreditCard },

  { to: "/footer", label: "Manage Footer", icon: Link2 },
  { to: "/newsletter", label: "Newsletter", icon: Mail },
  { to: "/footer/social", label: "Footer Social Links", icon: Link2 },
  { to: "/footer/columns", label: "Footer Columns", icon: Link2 },
  { to: "/footer/payments", label: "Footer Payments", icon: CreditCard },
  { to: "/footer/about", label: "About Page", icon: Home },
  { to: "/footer/contact", label: "Contact Page", icon: Phone },
  { to: "/footer/privacy-policy", label: "Privacy Policy", icon: FileText },
  { to: "/footer/terms", label: "Terms of Use", icon: FileText },
  { to: "/footer/shipping-policy", label: "Shipping Policy", icon: Truck },
  { to: "/footer/return-refund", label: "Return & Refund", icon: RotateCcw },
];


export default function Sidebar({ collapsed, onToggle }) {
  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-64"
      } hidden md:flex flex-col border-r border-slate-800 bg-slate-900/70 backdrop-blur transition-all duration-200`}
    >
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-900 font-black text-lg">
            A
          </div>
          {!collapsed && (
            <span className="font-semibold tracking-tight text-sm">
              Admin Panel
            </span>
          )}
        </div>

        <button
          onClick={onToggle}
          className="hidden md:inline-flex text-xs text-slate-400 hover:text-slate-100"
        >
          {collapsed ? ">" : "<"}
        </button>
      </div>

      <nav className="flex-1 px-2 space-y-1">
        {menuItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition ${
                isActive
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40"
                  : "text-slate-300 hover:bg-slate-800 hover:text-slate-100"
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}