import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";

export default function TransactionHistory() {
  const { transactions } = useApp();

  return (
    <div className="space-y-4 pb-6">
      <h1 className="text-xl font-bold text-foreground">Transaction History</h1>

      {transactions.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">No transactions yet</p>
      ) : (
        <div className="space-y-2">
          {transactions.map((txn, i) => (
            <motion.div
              key={txn.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="card-elevated p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                    <span className="text-sm font-semibold text-secondary-foreground">{txn.recipient[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{txn.recipient}</p>
                    <p className="text-xs text-muted-foreground">{txn.upiId}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">₹{txn.amount.toLocaleString("en-IN")}</p>
                  <span className={txn.status === "success" ? "status-success" : txn.status === "failed" ? "status-danger" : "status-warning"}>
                    {txn.status === "success" ? "Success" : txn.status === "failed" ? "Failed" : "Pending"}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                <span>{txn.id}</span>
                <span>Risk: {txn.riskScore}</span>
                <span>{txn.timestamp.toLocaleDateString()}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
