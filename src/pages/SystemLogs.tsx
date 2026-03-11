import { useApp } from "@/context/AppContext";
import { Info, AlertTriangle, XCircle, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ICONS = {
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
  success: CheckCircle,
};

const COLORS = {
  info: "text-primary",
  warning: "text-warning",
  error: "text-destructive",
  success: "text-success",
};

export default function SystemLogs() {
  const { systemLogs } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">System Logs</h1>
        <p className="text-sm text-muted-foreground mt-1">Engine events and activity log</p>
      </div>

      <div className="card-elevated divide-y">
        <AnimatePresence initial={false}>
          {systemLogs.map((log) => {
            const Icon = ICONS[log.type];
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center gap-3 px-5 py-3"
              >
                <Icon className={`h-4 w-4 shrink-0 ${COLORS[log.type]}`} />
                <span className="flex-1 text-sm text-foreground">{log.message}</span>
                <span className="text-[11px] text-muted-foreground whitespace-nowrap font-mono">
                  {log.timestamp.toLocaleTimeString()}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
