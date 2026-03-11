import { useApp } from "@/context/AppContext";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

const PIE_COLORS = ["hsl(152,60%,42%)", "hsl(38,92%,50%)", "hsl(0,72%,51%)"];

export default function RiskAnalytics() {
  const { transactions } = useApp();

  const approved = transactions.filter((t) => t.decision === "Approved").length;
  const otp = transactions.filter((t) => t.decision === "OTP Required").length;
  const blocked = transactions.filter((t) => t.decision === "Blocked").length;
  const pieData = [
    { name: "Approved", value: approved },
    { name: "OTP Required", value: otp },
    { name: "Blocked", value: blocked },
  ];

  const ranges = ["0-20", "21-40", "41-60", "61-80", "81-100"];
  const barData = ranges.map((range) => {
    const [min, max] = range.split("-").map(Number);
    return { range, count: transactions.filter((t) => t.riskScore >= min && t.riskScore <= max).length };
  });

  // Aggregate risk factors
  const factorMap: Record<string, number> = {};
  transactions.forEach((t) => t.riskFactors.forEach((f) => { factorMap[f.name] = (factorMap[f.name] || 0) + 1; }));
  const radarData = [
    { signal: "Geo Risk", value: factorMap["Geo Velocity Anomaly"] || 0 },
    { signal: "Velocity Risk", value: (factorMap["High Velocity"] || 0) },
    { signal: "Device Risk", value: factorMap["New Device"] || 0 },
    { signal: "Amount Risk", value: factorMap["High Amount"] || 0 },
    { signal: "Network Risk", value: (factorMap["VPN / Proxy Detected"] || 0) },
    { signal: "Behavioral Risk", value: factorMap["Behavioral Anomaly"] || 0 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Risk Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Fraud engine performance and risk distribution</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pie */}
        <div className="card-elevated p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Decision Breakdown</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" strokeWidth={2}>
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: "1px solid hsl(220,15%,90%)" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: PIE_COLORS[i] }} />
                {d.name}
              </div>
            ))}
          </div>
        </div>

        {/* Bar */}
        <div className="card-elevated p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Risk Score Distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,90%)" />
              <XAxis dataKey="range" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: "1px solid hsl(220,15%,90%)" }} />
              <Bar dataKey="count" fill="hsl(220,70%,50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar */}
        <div className="card-elevated p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Fraud Engine Signals</h3>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(220,15%,90%)" />
              <PolarAngleAxis dataKey="signal" tick={{ fontSize: 10 }} />
              <PolarRadiusAxis tick={{ fontSize: 9 }} />
              <Radar dataKey="value" stroke="hsl(220,70%,50%)" fill="hsl(220,70%,50%)" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
