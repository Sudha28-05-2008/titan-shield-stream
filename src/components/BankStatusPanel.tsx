import { useApp } from "@/context/AppContext";
import { Activity } from "lucide-react";

export default function BankStatusPanel() {
  const { bankStatuses } = useApp();

  const statusColor = (s: string) =>
    s === "operational" ? "bg-success" : s === "high-latency" ? "bg-warning" : "bg-destructive";

  const statusLabel = (s: string) =>
    s === "operational" ? "Operational" : s === "high-latency" ? "High Latency" : "Server Down";

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Activity className="h-4 w-4 text-primary" />
        <h2 className="text-base font-semibold text-foreground">Bank Server Status</h2>
      </div>
      <div className="space-y-2">
        {bankStatuses.map((bank) => (
          <div key={bank.code} className="card-elevated p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center">
                <span className="text-xs font-bold text-secondary-foreground">{bank.code}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{bank.name}</p>
                <p className="text-xs text-muted-foreground">
                  UPI: {bank.upiGateway === "active" ? "Active" : bank.upiGateway === "degraded" ? "Degraded" : "Offline"}
                </p>
              </div>
            </div>
            <div className="text-right flex items-center gap-2">
              <div>
                <p className="text-xs font-medium text-foreground">
                  {bank.status === "down" ? "No Response" : `${bank.responseTime}ms`}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {bank.lastUpdated.toLocaleTimeString()}
                </p>
              </div>
              <div className={`h-2.5 w-2.5 rounded-full ${statusColor(bank.status)}`}
                title={statusLabel(bank.status)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
