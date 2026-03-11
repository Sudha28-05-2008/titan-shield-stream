import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { analyzeTransaction, generateTransactionId, RiskAnalysis, Transaction } from "@/lib/paymentEngine";
import { ArrowLeft, Shield, AlertTriangle, CheckCircle2, XCircle, Loader2, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Step = "form" | "analyzing" | "analysis" | "confirm" | "result";

export default function Pay() {
  const navigate = useNavigate();
  const { balance, bankStatuses, addTransaction, deductBalance } = useApp();

  const [recipient, setRecipient] = useState("");
  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [step, setStep] = useState<Step>("form");
  const [analysis, setAnalysis] = useState<RiskAnalysis | null>(null);
  const [result, setResult] = useState<"success" | "failed" | null>(null);

  const selectedBankStatus = bankStatuses.find((b) => b.code === selectedBank);

  const handleAnalyze = () => {
    if (!recipient || !upiId || !amount) return;
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return;

    setStep("analyzing");
    setTimeout(() => {
      const a = analyzeTransaction(amt, selectedBankStatus);
      setAnalysis(a);

      // Warn if bank is down
      if (selectedBankStatus?.status === "down") {
        a.recommendation = `The selected bank (${selectedBankStatus.name}) server is currently unavailable. Try again later or choose another bank.`;
      }

      setStep("analysis");
    }, 1500);
  };

  const handleProceed = () => {
    if (!analysis) return;
    const amt = parseFloat(amount);

    if (analysis.decision === "blocked") {
      setResult("failed");
      const txn: Transaction = {
        id: generateTransactionId(), recipient, upiId, amount: amt,
        riskScore: analysis.fraudRiskScore, failureProbability: analysis.failureProbability,
        status: "failed", decision: "blocked", riskFactors: analysis.riskFactors,
        timestamp: new Date(), bank: selectedBankStatus?.name,
      };
      addTransaction(txn);
      setStep("result");
      return;
    }

    const failed = Math.random() * 100 < analysis.failureProbability;
    if (failed) {
      setResult("failed");
    } else {
      setResult("success");
      deductBalance(amt);
    }

    const txn: Transaction = {
      id: generateTransactionId(), recipient, upiId, amount: amt,
      riskScore: analysis.fraudRiskScore, failureProbability: analysis.failureProbability,
      status: failed ? "failed" : "success", decision: analysis.decision,
      riskFactors: analysis.riskFactors, timestamp: new Date(),
      bank: selectedBankStatus?.name,
    };
    addTransaction(txn);
    setStep("result");
  };

  const riskColor = (score: number) =>
    score < 40 ? "text-success" : score <= 70 ? "text-warning" : "text-destructive";

  const riskLabel = (score: number) =>
    score < 40 ? "Low Risk" : score <= 70 ? "Medium Risk" : "High Risk";

  return (
    <div className="pb-6">
      <button onClick={() => step === "form" ? navigate("/home") : setStep("form")} className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <AnimatePresence mode="wait">
        {step === "form" && (
          <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
            <h1 className="text-xl font-bold text-foreground">Send Money</h1>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Recipient Name</label>
                <input value={recipient} onChange={(e) => setRecipient(e.target.value)}
                  className="w-full rounded-xl border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. Rahul" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">UPI ID</label>
                <input value={upiId} onChange={(e) => setUpiId(e.target.value)}
                  className="w-full rounded-xl border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. rahul@upi" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Amount (₹)</label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-xl border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. 5000" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Select Bank</label>
                <select value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full rounded-xl border bg-card px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">Auto Select</option>
                  {bankStatuses.map((b) => (
                    <option key={b.code} value={b.code}>
                      {b.name} – {b.status === "operational" ? "✅" : b.status === "high-latency" ? "⚠️" : "❌"} {b.responseTime}ms
                    </option>
                  ))}
                </select>
              </div>

              {selectedBankStatus?.status === "down" && (
                <div className="flex items-start gap-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Payment Risk Alert</p>
                    <p className="text-xs mt-0.5">{selectedBankStatus.name} server is currently unavailable. Try another bank.</p>
                  </div>
                </div>
              )}
            </div>

            <button onClick={handleAnalyze}
              disabled={!recipient || !upiId || !amount}
              className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
              Analyze & Pay
            </button>
          </motion.div>
        )}

        {step === "analyzing" && (
          <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
            <p className="text-sm font-medium text-foreground">Analyzing Transaction Risk...</p>
            <p className="text-xs text-muted-foreground mt-1">Checking fraud signals & bank status</p>
          </motion.div>
        )}

        {step === "analysis" && analysis && (
          <motion.div key="analysis" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" /> Transaction Risk Analysis
            </h2>

            <div className="card-elevated p-5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Fraud Risk Score</span>
                <span className={`text-lg font-bold ${riskColor(analysis.fraudRiskScore)}`}>
                  {analysis.fraudRiskScore} <span className="text-xs font-medium">({riskLabel(analysis.fraudRiskScore)})</span>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Failure Probability</span>
                <span className="text-lg font-bold text-foreground">{analysis.failureProbability}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Network</span>
                <span className={`text-sm font-semibold ${analysis.networkStrength === "strong" ? "text-success" : analysis.networkStrength === "moderate" ? "text-warning" : "text-destructive"}`}>
                  {analysis.networkStrength.charAt(0).toUpperCase() + analysis.networkStrength.slice(1)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Bank Server</span>
                <span className={`text-sm font-semibold ${analysis.bankServerStatus === "operational" ? "text-success" : analysis.bankServerStatus === "high-latency" ? "text-warning" : "text-destructive"}`}>
                  {analysis.bankServerStatus === "operational" ? "Operational" : analysis.bankServerStatus === "high-latency" ? "High Latency" : "Down"}
                </span>
              </div>
            </div>

            {analysis.riskFactors.length > 0 && (
              <div className="card-elevated p-4">
                <p className="text-xs font-semibold text-muted-foreground mb-2">RISK FACTORS</p>
                {analysis.riskFactors.map((f, i) => (
                  <div key={i} className="flex justify-between text-sm py-1">
                    <span className="text-foreground">{f.name}</span>
                    <span className="text-destructive font-medium">+{f.score}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="rounded-xl bg-accent p-3.5">
              <p className="text-xs font-semibold text-accent-foreground mb-1">Recommendation</p>
              <p className="text-sm text-foreground">{analysis.recommendation}</p>
            </div>

            <div className="card-elevated p-5">
              <p className="text-center text-sm text-muted-foreground mb-1">
                Send <span className="font-bold text-foreground">₹{parseFloat(amount).toLocaleString("en-IN")}</span> to <span className="font-bold text-foreground">{recipient}</span>?
              </p>
              <div className="flex gap-3 mt-4">
                <button onClick={() => setStep("form")}
                  className="flex-1 rounded-xl border py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
                  Cancel
                </button>
                <button onClick={handleProceed}
                  disabled={analysis.decision === "blocked"}
                  className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
                  {analysis.decision === "blocked" ? "Blocked" : "Proceed"}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === "result" && (
          <motion.div key="result" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center">
            {result === "success" ? (
              <>
                <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8 text-success" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Payment Successful!</h2>
                <p className="text-sm text-muted-foreground mt-1">₹{parseFloat(amount).toLocaleString("en-IN")} sent to {recipient}</p>
              </>
            ) : (
              <>
                <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                  <XCircle className="h-8 w-8 text-destructive" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Payment Failed</h2>
                <p className="text-sm text-muted-foreground mt-1">Transaction could not be completed</p>
              </>
            )}
            <button onClick={() => navigate("/home")}
              className="mt-8 rounded-xl bg-primary px-8 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              Back to Home
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
