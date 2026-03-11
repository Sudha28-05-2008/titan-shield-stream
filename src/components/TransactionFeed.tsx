import type { Transaction } from "@/lib/riskEngine";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  transactions: Transaction[];
  showRiskBreakdown?: boolean;
}

export default function TransactionFeed({ transactions, showRiskBreakdown }: Props) {
  return (
    <div className="card-elevated overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Transaction ID</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Amount</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Device</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Location</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Risk Score</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Decision</th>
              {showRiskBreakdown && <th className="px-4 py-3 text-left font-medium text-muted-foreground">Risk Factors</th>}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {transactions.map((txn) => (
                <motion.tr
                  key={txn.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-b last:border-0 hover:bg-muted/30"
                >
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-foreground">{txn.id}</td>
                  <td className="px-4 py-3 font-semibold text-foreground">₹{txn.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-muted-foreground">{txn.device}</td>
                  <td className="px-4 py-3 text-muted-foreground">{txn.location}</td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${txn.riskScore < 40 ? "text-success" : txn.riskScore <= 70 ? "text-warning" : "text-destructive"}`}>
                      {txn.riskScore}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={txn.decision === "Approved" ? "status-approved" : txn.decision === "OTP Required" ? "status-otp" : "status-blocked"}>
                      {txn.decision}
                    </span>
                  </td>
                  {showRiskBreakdown && (
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {txn.riskFactors.map((f) => (
                          <span key={f.name} className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                            {f.name} +{f.score}
                          </span>
                        ))}
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
