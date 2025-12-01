import { useAuth } from "../../auth/useAuth";
import { LogOut } from "lucide-react";

export default function Topbar() {
  const { admin, logout } = useAuth();

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-900/70 backdrop-blur flex items-center justify-between px-4">
      <div className="text-sm font-semibold text-slate-100 md:hidden">
        Admin Panel
      </div>
      <div className="flex-1 flex justify-end gap-4 items-center text-xs text-slate-400">
        <span className="hidden sm:inline">
          {admin?.email || admin?.username || "Admin"}
        </span>
        <button
          onClick={logout}
          className="inline-flex items-center gap-1 text-red-400 hover:text-red-300"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
