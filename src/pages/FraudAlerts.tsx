import { useApp } from "@/context/AppContext";
import { ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FraudAlerts() {
  const { fraudAlerts } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Fraud Alerts</h1>
        <p className="text-sm text-muted-foreground mt-1">{fraudAlerts.length} active alerts</p>
      </div>

      {fraudAlerts.length === 0 ? (
        <div className="card-elevated p-12 text-center">
          <ShieldAlert className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No fraud alerts detected yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {fraudAlerts.slice(0, 30).map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card-elevated p-5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 rounded-full p-2 ${alert.severity === "critical" ? "bg-destructive/10" : alert.severity === "high" ? "bg-warning/10" : "bg-muted"}`}>
                      <ShieldAlert className={`h-4 w-4 ${alert.severity === "critical" ? "text-destructive" : alert.severity === "high" ? "text-warning" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{alert.title}</h3>
                      <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                        <p>User: <span className="font-mono font-medium text-foreground">{alert.user}</span></p>
                        <p>Amount: <span className="font-semibold text-foreground">₹{alert.amount.toLocaleString()}</span></p>
                        <p>Reason: <span className="text-foreground">{alert.reason}</span></p>
                        <p>Action: <span className={alert.action.includes("Blocked") ? "text-destructive font-semibold" : "text-warning font-semibold"}>{alert.action}</span></p>
                      </div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${alert.severity === "critical" ? "text-destructive" : alert.severity === "high" ? "text-warning" : "text-muted-foreground"}`}>
                    {alert.severity}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
