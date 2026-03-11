import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Home, Send, BarChart3, Settings, History } from "lucide-react";

const NAV_ITEMS = [
  { path: "/home", label: "Home", icon: Home },
  { path: "/pay", label: "Pay", icon: Send },
  { path: "/transaction-history", label: "History", icon: History },
  { path: "/risk-analysis", label: "Analytics", icon: BarChart3 },
  { path: "/settings", label: "Settings", icon: Settings },
];

export default function MobileLayout() {
  const { isAuthenticated } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="flex justify-center min-h-screen bg-background">
      <div className="w-full max-w-md flex flex-col min-h-screen relative">
        <main className="flex-1 overflow-y-auto px-4 pt-4 pb-24">
          <Outlet />
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md border-t bg-card px-2 pb-2 pt-1 z-30"
          style={{ borderColor: "hsl(var(--nav-border))" }}>
          <div className="flex justify-around">
            {NAV_ITEMS.map((item) => {
              const active = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`nav-item ${active ? "nav-item-active" : "nav-item-inactive"}`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
