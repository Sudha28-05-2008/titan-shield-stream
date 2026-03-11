import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";
import { Smartphone, DollarSign, UserX, Globe, TrendingUp, Clock, Fingerprint, Lock, MapPin, Zap } from "lucide-react";

const SCENARIOS = [
  { id: "new-device", title: "New Device Login", desc: "New device with high value transaction", icon: Smartphone },
  { id: "high-amount", title: "High Amount Transfer", desc: "₹75,000 when average is ₹500", icon: DollarSign },
  { id: "account-takeover", title: "Account Takeover", desc: "New device + no KYC + high amount", icon: UserX },
  { id: "vpn-abuse", title: "VPN / Proxy Abuse", desc: "Multiple attempts from masked IP", icon: Globe },
  { id: "limit-breach", title: "Transaction Limit Breach", desc: "User exceeds daily limit", icon: TrendingUp },
  { id: "dormant", title: "Dormant Account Reactivation", desc: "Account inactive >90 days suddenly active", icon: Clock },
  { id: "session-hijack", title: "Session Hijacking", desc: "Same session ID used by multiple devices", icon: Fingerprint },
  { id: "brute-force", title: "Brute Force Login", desc: "Multiple failed login attempts", icon: Lock },
  { id: "geo-velocity", title: "Geo Velocity Fraud", desc: "Transaction from two distant locations in seconds", icon: MapPin },
  { id: "txn-velocity", title: "Transaction Velocity Fraud", desc: "10 transactions within 20 seconds", icon: Zap },
];

export default function Simulator() {
  const { simulateScenario } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Fraud Scenario Simulator</h1>
        <p className="text-sm text-muted-foreground mt-1">Simulate attack scenarios to test the fraud engine</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {SCENARIOS.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card-elevated p-5 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <s.icon className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">{s.title}</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4 flex-1">{s.desc}</p>
            <button
              onClick={() => simulateScenario(s.id)}
              className="w-full rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
            >
              Simulate Attack
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
