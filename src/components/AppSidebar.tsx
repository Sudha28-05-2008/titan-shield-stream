import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import {
  LayoutDashboard,
  ArrowLeftRight,
  ShieldAlert,
  BarChart3,
  FlaskConical,
  ScrollText,
  LogOut,
  Shield,
} from "lucide-react";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { path: "/fraud-alerts", label: "Fraud Alerts", icon: ShieldAlert },
  { path: "/risk-analytics", label: "Risk Analytics", icon: BarChart3 },
  { path: "/simulator", label: "Simulator", icon: FlaskConical },
  { path: "/system-logs", label: "System Logs", icon: ScrollText },
];

export default function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useApp();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col" style={{ background: "hsl(var(--sidebar-bg))" }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: "hsl(var(--sidebar-active))" }}>
          <Shield className="h-5 w-5" style={{ color: "hsl(var(--sidebar-primary-foreground))" }} />
        </div>
        <div>
          <h1 className="text-base font-bold" style={{ color: "hsl(var(--sidebar-accent-foreground))" }}>SecurePay</h1>
          <p className="text-[11px] font-medium" style={{ color: "hsl(var(--sidebar-fg))" }}>v1.0</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 mt-2">
        {NAV_ITEMS.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`sidebar-link w-full ${active ? "sidebar-link-active" : "sidebar-link-inactive"}`}
            >
              <item.icon className="h-[18px] w-[18px]" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-6">
        <button
          onClick={() => { logout(); navigate("/login"); }}
          className="sidebar-link sidebar-link-inactive w-full"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
