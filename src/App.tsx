import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import FraudAlerts from "./pages/FraudAlerts";
import RiskAnalytics from "./pages/RiskAnalytics";
import Simulator from "./pages/Simulator";
import SystemLogs from "./pages/SystemLogs";
import DashboardLayout from "./components/DashboardLayout";
import NotFound from "./pages/NotFound";

const App = () => (
  <AppProvider>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/fraud-alerts" element={<FraudAlerts />} />
            <Route path="/risk-analytics" element={<RiskAnalytics />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/system-logs" element={<SystemLogs />} />
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </AppProvider>
);

export default App;
