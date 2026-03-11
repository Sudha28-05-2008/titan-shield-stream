import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import {
  Transaction,
  BankStatus,
  generateBankStatuses,
  generateRandomTransaction,
} from "@/lib/paymentEngine";

interface AppState {
  isAuthenticated: boolean;
  balance: number;
  transactions: Transaction[];
  bankStatuses: BankStatus[];
  login: (pin: string) => boolean;
  logout: () => void;
  addTransaction: (txn: Transaction) => void;
  deductBalance: (amount: number) => void;
}

const AppContext = createContext<AppState | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem("sp_auth") === "1");
  const [balance, setBalance] = useState(10000);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bankStatuses, setBankStatuses] = useState<BankStatus[]>(() => generateBankStatuses());
  const bankInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const login = useCallback((pin: string) => {
    if (pin === "1234") {
      sessionStorage.setItem("sp_auth", "1");
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem("sp_auth");
    setIsAuthenticated(false);
  }, []);

  const addTransaction = useCallback((txn: Transaction) => {
    setTransactions((prev) => [txn, ...prev].slice(0, 200));
  }, []);

  const deductBalance = useCallback((amount: number) => {
    setBalance((prev) => prev - amount);
  }, []);

  // Seed transactions
  useEffect(() => {
    if (isAuthenticated && transactions.length === 0) {
      const seed: Transaction[] = [];
      for (let i = 0; i < 10; i++) seed.push(generateRandomTransaction());
      seed.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      setTransactions(seed);
    }
  }, [isAuthenticated]);

  // Bank status refresh every 8 seconds
  useEffect(() => {
    if (isAuthenticated) {
      bankInterval.current = setInterval(() => {
        setBankStatuses(generateBankStatuses());
      }, 8000);
    }
    return () => { if (bankInterval.current) clearInterval(bankInterval.current); };
  }, [isAuthenticated]);

  return (
    <AppContext.Provider value={{ isAuthenticated, balance, transactions, bankStatuses, login, logout, addTransaction, deductBalance }}>
      {children}
    </AppContext.Provider>
  );
}
