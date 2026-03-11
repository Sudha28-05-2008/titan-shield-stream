import { Navigate, Outlet } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import AppSidebar from "./AppSidebar";

export default function DashboardLayout() {
  const { isAuthenticated, isLiveMode, toggleLiveMode } = useApp();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b bg-card px-8 py-3">
          <h2 className="text-sm font-semibold text-foreground">SecurePay v1.0</h2>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-muted-foreground">{isLiveMode ? "Live" : "Demo"}</span>
            <button
              onClick={toggleLiveMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isLiveMode ? "bg-success" : "bg-muted"}`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-card shadow transition-transform ${isLiveMode ? "translate-x-6" : "translate-x-1"}`}
              />
            </button>
            {isLiveMode && (
              <span className="flex items-center gap-1.5 text-xs font-medium text-success">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse-dot" />
                Live
              </span>
            )}
          </div>
        </header>
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
