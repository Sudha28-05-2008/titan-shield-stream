import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Pay from "./pages/Pay";
import TransactionHistory from "./pages/TransactionHistory";
import RiskAnalytics from "./pages/RiskAnalytics";
import Settings from "./pages/Settings";
import MobileLayout from "./components/MobileLayout";
import NotFound from "./pages/NotFound";

const App = () => (
  <AppProvider>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<MobileLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/pay" element={<Pay />} />
            <Route path="/transaction-history" element={<TransactionHistory />} />
            <Route path="/risk-analysis" element={<RiskAnalytics />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </AppProvider>
);

export default App;
