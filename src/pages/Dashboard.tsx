import { useApp } from "@/context/AppContext";
import { ArrowLeftRight, CheckCircle2, ShieldCheck, ShieldAlert, Gauge, Timer } from "lucide-react";
import TransactionFeed from "@/components/TransactionFeed";

export default function Dashboard() {
  const { transactions } = useApp();

  const approved = transactions.filter((t) => t.decision === "Approved").length;
  const otp = transactions.filter((t) => t.decision === "OTP Required").length;
  const blocked = transactions.filter((t) => t.decision === "Blocked").length;
  const meanRisk = transactions.length ? Math.round(transactions.reduce((a, t) => a + t.riskScore, 0) / transactions.length) : 0;

  const metrics = [
    { label: "Transactions Processed", value: transactions.length.toLocaleString(), icon: ArrowLeftRight, color: "text-primary" },
    { label: "Auto Approved", value: approved.toLocaleString(), icon: CheckCircle2, color: "text-success" },
    { label: "Step-Up Authentication", value: otp.toLocaleString(), icon: ShieldCheck, color: "text-warning" },
    { label: "Fraud Prevented", value: blocked.toLocaleString(), icon: ShieldAlert, color: "text-destructive" },
    { label: "Mean Risk Score", value: meanRisk.toString(), icon: Gauge, color: "text-primary" },
    { label: "Decision Time", value: "12ms", icon: Timer, color: "text-muted-foreground" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time fraud monitoring overview</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {metrics.map((m) => (
          <div key={m.label} className="metric-card">
            <div className="flex items-center justify-between mb-3">
              <m.icon className={`h-5 w-5 ${m.color}`} />
            </div>
            <p className="text-2xl font-bold text-foreground">{m.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Live Transaction Feed</h2>
        <TransactionFeed transactions={transactions.slice(0, 20)} />
      </div>
    </div>
  );
}
