import { useState } from "react";
import { useAuth } from "../../auth/useAuth";
import { LogOut, Menu, User, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

export default function Topbar({ onMobileToggle }) {
  const { admin, logout } = useAuth();
  const [openMenu, setOpenMenu] = useState(false);

  const toggleMenu = () => setOpenMenu((prev) => !prev);

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-900/70 backdrop-blur flex items-center justify-between px-4 relative z-[9999]">

      {/* ⭐ MOBILE MENU BUTTON */}
      <button
        onClick={onMobileToggle}
        className="text-slate-200 hover:text-white md:hidden"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Title only on Desktop */}
      <div className="text-sm font-semibold text-slate-100 hidden md:block">
        Admin Panel
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">

        {/* ⭐ USER DROPDOWN */}
        <div className="relative">
          <button
            onClick={toggleMenu}
            className="flex items-center gap-2 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 transition"
          >
            <User className="w-4 h-4 text-slate-300" />
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {openMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-lg shadow-lg py-2 z-50 animate-fadeIn">

              {/* EMAIL */}
              <div className="px-4 py-2 text-xs text-slate-400 border-b border-slate-700">
                {admin?.email || admin?.username || "Admin"}
              </div>

              {/* PROFILE LINK */}
              <Link
                to="/profile"
                className="px-4 py-2 text-sm text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                onClick={() => setOpenMenu(false)}
              >
                <User className="w-4 h-4" />
                My Profile
              </Link>

              {/* LOGOUT */}
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>

            </div>
          )}
        </div>
      </div>

    </header>
  );
}
