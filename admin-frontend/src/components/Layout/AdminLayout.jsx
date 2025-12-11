// src/components/Layout/AdminLayout.jsx
import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Desktop collapse
  const toggleDesktopSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  // Mobile open/close
  const toggleMobileSidebar = () => {
    setIsMobileOpen((prev) => !prev);
  };

  return (
    <div className="flex bg-slate-950 text-slate-100 h-screen overflow-hidden">

      {/* ⭐ FIXED SIDEBAR */}
      <Sidebar
        collapsed={collapsed}
        onToggle={toggleDesktopSidebar}
        isMobileOpen={isMobileOpen}
        onMobileToggle={toggleMobileSidebar}
      />

      {/* ⭐ MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">

        {/* TOPBAR */}
        <Topbar onMobileToggle={toggleMobileSidebar} />

        {/* ⭐ ONLY THIS SCROLLS NOW */}
        <main className="flex-1 overflow-y-auto p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          {children}
        </main>
      </div>
    </div>
  );
}
