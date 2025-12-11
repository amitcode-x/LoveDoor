import { useEffect, useState, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
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
  FileText,
  RotateCcw,
  Truck,
} from "lucide-react";

import { getUnseenOrdersCount, markOrdersSeen } from "../../api/adminApi";

function Tooltip({ text }) {
  return (
    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-black text-white text-xs rounded shadow-lg whitespace-nowrap z-50">
      {text}
    </div>
  );
}

const groupedMenu = [
  {
    heading: "GENERAL",
    items: [
      { to: "/profile", label: "Profile", icon: Users },
      { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
      { to: "/orders", label: "Orders", icon: ShoppingBag },
      { to: "/users", label: "Users", icon: Users },
      { to: "/payments", label: "Payments", icon: CreditCard },
    ],
  },
  {
    heading: "PRODUCTS",
    items: [
      { to: "/products", label: "Products", icon: Package },
      { to: "/categories", label: "Categories", icon: Shapes },
    ],
  },
  {
    heading: "HOMEPAGE SETTINGS",
    items: [
      { to: "/homepage", label: "Homepage", icon: Home },
      { to: "/homepage/static-hero", label: "Static Hero", icon: Home },
      { to: "/admin/homepage/hero-slides", label: "Hero Slides", icon: Home },
      { to: "/homepage/featured-offers", label: "Featured Offers", icon: Home },
      { to: "/homepage/secondary-hero", label: "Secondary Hero", icon: Home },
      { to: "/homepage/gift-offer", label: "Gift Offer", icon: Home },
      { to: "/admin/homepage/service-features", label: "Service Features", icon: Home },
    ],
  },
  {
    heading: "FOOTER & PAGES",
    items: [
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
    ],
  },
];

export default function Sidebar({
  collapsed,
  onToggle,
  isMobileOpen,
  onMobileToggle,
}) {
  const [unseenCount, setUnseenCount] = useState(0);
  const [search, setSearch] = useState("");
  const [hovered, setHovered] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const navRefs = useRef([]);
  const [highlightIndex, setHighlightIndex] = useState(0);

  async function load() {
    try {
      const token = localStorage.getItem("admin_access_token");
      if (!token) return;
      const res = await getUnseenOrdersCount();
      setUnseenCount(res.data.count);
    } catch {}
  }

  useEffect(() => {
    load();
    const i = setInterval(load, 5000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith("/orders")) {
      markOrdersSeen().catch(() => {});
      setUnseenCount(0);
    }
  }, [location.pathname]);

  const flatMenu = groupedMenu.flatMap((g) => g.items);
  const filteredItems = flatMenu.filter((i) =>
    i.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    navRefs.current = [];
    setHighlightIndex(0);
  }, [search]);

  useEffect(() => {
    if (navRefs.current[highlightIndex]) {
      navRefs.current[highlightIndex].focus();
    }
  }, [highlightIndex]);

  const handleKeyDown = (e, itemsList) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev + 1 < itemsList.length ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev - 1 >= 0 ? prev - 1 : prev
      );
    } else if (e.key === "Enter") {
      if (search.trim() !== "") {
        const first = filteredItems[0];
        if (first) return navigate(first.to);
      }
      const item = itemsList[highlightIndex];
      if (item) navigate(item.to);
    }
  };

  const hiddenScrollbar = {
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  };

  const renderMenu = (isMobile = false) => {
    const isCollapsed = isMobile ? false : collapsed;

    const itemsList = search.trim() !== "" ? filteredItems : flatMenu;

    return (
      <div
        className="h-full overflow-y-auto px-3 py-2 space-y-4"
        style={hiddenScrollbar}
        onKeyDown={(e) => handleKeyDown(e, itemsList)}
      >
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>

        {!isCollapsed && (
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const first = filteredItems[0];
                if (first) navigate(first.to);
              }
            }}
            placeholder="Search..."
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-sm rounded-lg"
          />
        )}

        {(search.trim() !== "" ? filteredItems : groupedMenu).map(
          (group, gIndex) => {
            if (search.trim() !== "") {
              return filteredItems.map((item, i) => (
                <MenuItem
                  key={item.to}
                  item={item}
                  index={i}
                  collapsed={isCollapsed}
                  hovered={hovered}
                  setHovered={setHovered}
                  refEl={navRefs}
                  highlightIndex={highlightIndex}
                  isMobile={isMobile}
                  onMobileToggle={onMobileToggle}
                  unseenCount={unseenCount}
                />
              ));
            }

            return (
              <div key={group.heading}>
                {!isCollapsed && (
                  <div className="text-[10px] text-slate-500 font-bold px-2 mb-1">
                    {group.heading}
                  </div>
                )}

                {group.items.map((item, i) => {
                  const flatIndex =
                    groupedMenu
                      .slice(0, gIndex)
                      .flatMap((g) => g.items).length + i;

                  return (
                    <MenuItem
                      key={item.to}
                      item={item}
                      index={flatIndex}
                      collapsed={isCollapsed}
                      hovered={hovered}
                      setHovered={setHovered}
                      refEl={navRefs}
                      highlightIndex={highlightIndex}
                      isMobile={isMobile}
                      onMobileToggle={onMobileToggle}
                      unseenCount={unseenCount}
                    />
                  );
                })}
              </div>
            );
          }
        )}
      </div>
    );
  };

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => onMobileToggle(false)}
        />
      )}

      {/* MOBILE */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-300 md:hidden ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ height: "100vh" }}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700">
          <h2 className="text-lg">Admin Panel</h2>
          <button
            onClick={() => onMobileToggle(false)}
            className="text-2xl text-slate-300"
          >
            ×
          </button>
        </div>

        {renderMenu(true)}
      </div>

      {/* DESKTOP */}
      <aside
        className={`hidden md:flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
        style={{ height: "100vh" }}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-emerald-500 rounded-xl flex items-center justify-center font-bold">
              A
            </div>
            {!collapsed && (
              <span className="font-semibold text-sm">Admin Panel</span>
            )}
          </div>

          <button
            onClick={onToggle}
            className="text-xs text-slate-400 hover:text-white"
          >
            {collapsed ? ">" : "<"}
          </button>
        </div>

        {renderMenu(false)}
      </aside>
    </>
  );
}

// ⭐ SINGLE MENU ITEM COMPONENT
function MenuItem({
  item,
  index,
  collapsed,
  hovered,
  setHovered,
  refEl,
  highlightIndex,
  isMobile,
  onMobileToggle,
  unseenCount,
}) {
  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(item.label)}
      onMouseLeave={() => setHovered(null)}
    >
      <NavLink
        to={item.to}
        tabIndex={0}
        ref={(el) => (refEl.current[index] = el)}
        onClick={() => isMobile && onMobileToggle(false)}
        className={({ isActive }) =>
          `flex items-center justify-between px-3 py-2 rounded-lg text-sm outline-none transition ${
            index === highlightIndex ? "ring-2 ring-emerald-400" : ""
          } ${
            isActive
              ? "bg-emerald-500/20 text-emerald-300"
              : "text-slate-300 hover:bg-slate-800"
          }`
        }
      >
        <div className="flex items-center gap-3">
          <item.icon className="w-4 h-4" />
          {!collapsed && item.label}
        </div>

        {!collapsed && item.label === "Orders" && unseenCount > 0 && (
          <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">
            {unseenCount}
          </span>
        )}
      </NavLink>

      {collapsed && hovered === item.label && <Tooltip text={item.label} />}
    </div>
  );
}
