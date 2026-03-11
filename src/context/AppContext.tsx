import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import {
  Transaction,
  FraudAlert,
  SystemLog,
  generateRandomTransaction,
  generateScenarioTransaction,
  generateFraudAlert,
} from "@/lib/riskEngine";

interface AppState {
  isAuthenticated: boolean;
  isLiveMode: boolean;
  transactions: Transaction[];
  fraudAlerts: FraudAlert[];
  systemLogs: SystemLog[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  toggleLiveMode: () => void;
  simulateScenario: (scenario: string) => void;
}

const AppContext = createContext<AppState | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

function addLog(logs: SystemLog[], message: string, type: SystemLog["type"] = "info"): SystemLog[] {
  return [{ id: `LOG-${Date.now()}-${Math.random()}`, message, type, timestamp: new Date() }, ...logs].slice(0, 200);
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem("sp_auth") === "1");
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>([]);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>(() => [
    { id: "LOG-0", message: "Fraud Engine v3.2 initialized", type: "success", timestamp: new Date() },
    { id: "LOG-1", message: "Risk Model loaded – 14 signals active", type: "info", timestamp: new Date() },
    { id: "LOG-2", message: "System ready for monitoring", type: "info", timestamp: new Date() },
  ]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const login = useCallback((email: string, password: string) => {
    if (email === "admin@securepay.com" && password === "admin123") {
      sessionStorage.setItem("sp_auth", "1");
      setIsAuthenticated(true);
      setSystemLogs((l) => addLog(l, "User Login – admin@securepay.com", "info"));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem("sp_auth");
    setIsAuthenticated(false);
  }, []);

  const toggleLiveMode = useCallback(() => setIsLiveMode((p) => !p), []);

  // Live mode: generate transactions periodically
  useEffect(() => {
    if (isLiveMode && isAuthenticated) {
      intervalRef.current = setInterval(() => {
        const txn = generateRandomTransaction();
        setTransactions((prev) => [txn, ...prev].slice(0, 500));
        const alert = generateFraudAlert(txn);
        if (alert) {
          setFraudAlerts((prev) => [alert, ...prev].slice(0, 200));
          setSystemLogs((l) => addLog(l, `High Risk Transaction Detected – ${txn.id} (Score: ${txn.riskScore})`, "warning"));
        }
      }, 2000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isLiveMode, isAuthenticated]);

  // Seed some initial transactions
  useEffect(() => {
    if (isAuthenticated && transactions.length === 0) {
      const seed: Transaction[] = [];
      for (let i = 0; i < 15; i++) seed.push(generateRandomTransaction());
      setTransactions(seed);
      const alerts = seed.map(generateFraudAlert).filter(Boolean) as FraudAlert[];
      setFraudAlerts(alerts);
    }
  }, [isAuthenticated]);

  const simulateScenario = useCallback((scenario: string) => {
    const txn = generateScenarioTransaction(scenario);
    setTransactions((prev) => [txn, ...prev].slice(0, 500));
    setSystemLogs((l) => addLog(l, `Scenario Simulation Triggered – ${scenario}`, "warning"));
    const alert = generateFraudAlert(txn);
    if (alert) {
      setFraudAlerts((prev) => [alert, ...prev].slice(0, 200));
      setSystemLogs((l) => addLog(l, `Fraud Alert Generated – ${txn.id} (Score: ${txn.riskScore})`, "error"));
    }
    setSystemLogs((l) => addLog(l, `Transaction ${txn.id} processed – Decision: ${txn.decision}`, txn.decision === "Approved" ? "success" : "warning"));
  }, []);

  return (
    <AppContext.Provider
      value={{ isAuthenticated, isLiveMode, transactions, fraudAlerts, systemLogs, login, logout, toggleLiveMode, simulateScenario }}
    >
      {children}
    </AppContext.Provider>
  );
}
