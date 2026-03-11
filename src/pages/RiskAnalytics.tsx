import { useApp } from "@/context/AppContext";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function RiskAnalytics() {
  const { transactions } = useApp();

  const successCount = transactions.filter((t) => t.status === "success").length;
  const failedCount = transactions.filter((t) => t.status === "failed").length;
  const pendingCount = transactions.filter((t) => t.status === "pending").length;

  const pieData = [
    { name: "Success", value: successCount, color: "hsl(152 60% 42%)" },
    { name: "Failed", value: failedCount, color: "hsl(0 72% 51%)" },
    { name: "Pending", value: pendingCount, color: "hsl(38 92% 50%)" },
  ].filter((d) => d.value > 0);

  const riskBuckets = [
    { range: "0-20", count: transactions.filter((t) => t.riskScore <= 20).length },
    { range: "21-40", count: transactions.filter((t) => t.riskScore > 20 && t.riskScore <= 40).length },
    { range: "41-60", count: transactions.filter((t) => t.riskScore > 40 && t.riskScore <= 60).length },
    { range: "61-80", count: transactions.filter((t) => t.riskScore > 60 && t.riskScore <= 80).length },
    { range: "81-100", count: transactions.filter((t) => t.riskScore > 80).length },
  ];

  const failedTxns = transactions.filter((t) => t.status === "failed");
  const reasonMap: Record<string, number> = {};
  failedTxns.forEach((t) => {
    t.riskFactors.forEach((f) => {
      reasonMap[f.name] = (reasonMap[f.name] || 0) + 1;
    });
  });
  if (failedTxns.length > 0 && Object.keys(reasonMap).length === 0) {
    reasonMap["Network/Server Issue"] = failedTxns.length;
  }
  const failureReasons = Object.entries(reasonMap).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 5);

  return (
    <div className="space-y-6 pb-6">
      <h1 className="text-xl font-bold text-foreground">Risk Analytics</h1>

      <div className="card-elevated p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4">Transaction Success vs Failure</h2>
        {pieData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4}>
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">No data yet</p>
        )}
        <div className="flex justify-center gap-4 mt-2">
          {pieData.map((d) => (
            <div key={d.name} className="flex items-center gap-1.5 text-xs">
              <div className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
              <span className="text-muted-foreground">{d.name} ({d.value})</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card-elevated p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4">Fraud Risk Distribution</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={riskBuckets}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 91%)" />
            <XAxis dataKey="range" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" fill="hsl(225 75% 55%)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {failureReasons.length > 0 && (
        <div className="card-elevated p-5">
          <h2 className="text-sm font-semibold text-foreground mb-3">Failure Reasons Breakdown</h2>
          <div className="space-y-2">
            {failureReasons.map((r) => (
              <div key={r.name} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{r.name}</span>
                <span className="text-xs font-medium text-muted-foreground">{r.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
