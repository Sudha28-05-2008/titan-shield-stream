import { useApp } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { Send, QrCode, History, Shield, ChevronRight, Activity } from "lucide-react";
import { motion } from "framer-motion";
import BankStatusPanel from "@/components/BankStatusPanel";

export default function Home() {
  const { balance, transactions } = useApp();
  const navigate = useNavigate();

  const recentTxns = transactions.slice(0, 3);

  return (
    <div className="space-y-6 pb-6">
      {/* Balance Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="rounded-3xl p-6 text-primary-foreground shadow-lg"
        style={{ background: "linear-gradient(135deg, hsl(225 75% 55%), hsl(240 60% 45%))" }}
      >
        <div className="flex items-center gap-2 mb-1">
          <Shield className="h-5 w-5 opacity-80" />
          <span className="text-sm font-medium opacity-80">SecurePay Wallet</span>
        </div>
        <p className="text-3xl font-bold mt-2">₹{balance.toLocaleString("en-IN")}</p>
        <p className="text-sm opacity-70 mt-1">Available Balance</p>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Send Money", icon: Send, path: "/pay", color: "bg-primary" },
          { label: "Scan QR", icon: QrCode, path: "/pay", color: "bg-accent-foreground" },
          { label: "History", icon: History, path: "/transaction-history", color: "bg-success" },
        ].map((action) => (
          <motion.button
            key={action.label}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(action.path)}
            className="card-elevated p-4 flex flex-col items-center gap-3 hover:shadow-md transition-shadow"
          >
            <div className={`h-11 w-11 rounded-xl ${action.color} flex items-center justify-center`}>
              <action.icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xs font-medium text-foreground">{action.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Bank Server Status */}
      <BankStatusPanel />

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-foreground">Recent Transactions</h2>
          <button
            onClick={() => navigate("/transaction-history")}
            className="text-xs text-primary font-medium flex items-center gap-0.5"
          >
            View all <ChevronRight className="h-3 w-3" />
          </button>
        </div>
        <div className="space-y-2">
          {recentTxns.map((txn) => (
            <div key={txn.id} className="card-elevated p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                  <span className="text-sm font-semibold text-secondary-foreground">
                    {txn.recipient[0]}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{txn.recipient}</p>
                  <p className="text-xs text-muted-foreground">{txn.upiId}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">-₹{txn.amount.toLocaleString("en-IN")}</p>
                <span className={txn.status === "success" ? "status-success" : txn.status === "failed" ? "status-danger" : "status-warning"}>
                  {txn.status === "success" ? "Success" : txn.status === "failed" ? "Failed" : "Pending"}
                </span>
              </div>
            </div>
          ))}
          {recentTxns.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">No transactions yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
