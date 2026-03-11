export interface RiskFactor {
  name: string;
  score: number;
}

export interface BankStatus {
  name: string;
  code: string;
  status: "operational" | "high-latency" | "down";
  responseTime: number;
  upiGateway: "active" | "degraded" | "offline";
  lastUpdated: Date;
}

export interface Transaction {
  id: string;
  recipient: string;
  upiId: string;
  amount: number;
  riskScore: number;
  failureProbability: number;
  status: "success" | "failed" | "pending";
  decision: "safe" | "otp" | "blocked";
  riskFactors: RiskFactor[];
  timestamp: Date;
  bank?: string;
}

export interface RiskAnalysis {
  fraudRiskScore: number;
  failureProbability: number;
  networkStrength: "strong" | "moderate" | "slow";
  bankServerStatus: "operational" | "high-latency" | "down";
  recommendation: string;
  riskFactors: RiskFactor[];
  decision: "safe" | "otp" | "blocked";
}

let txnCounter = 88230;

export function generateTransactionId(): string {
  txnCounter++;
  return `TXN${txnCounter}`;
}

const BANKS: Omit<BankStatus, "status" | "responseTime" | "upiGateway" | "lastUpdated">[] = [
  { name: "State Bank of India", code: "SBI" },
  { name: "Indian Overseas Bank", code: "IOB" },
  { name: "HDFC Bank", code: "HDFC" },
  { name: "ICICI Bank", code: "ICICI" },
  { name: "Axis Bank", code: "AXIS" },
];

export function generateBankStatuses(): BankStatus[] {
  return BANKS.map((bank) => {
    const responseTime = Math.random() < 0.15 ? 800 + Math.floor(Math.random() * 500) :
      Math.random() < 0.3 ? 200 + Math.floor(Math.random() * 500) :
      50 + Math.floor(Math.random() * 150);

    const status: BankStatus["status"] =
      responseTime < 200 ? "operational" :
      responseTime <= 700 ? "high-latency" : "down";

    const upiGateway: BankStatus["upiGateway"] =
      status === "operational" ? "active" :
      status === "high-latency" ? "degraded" : "offline";

    return { ...bank, status, responseTime, upiGateway, lastUpdated: new Date() };
  });
}

export function analyzeTransaction(
  amount: number,
  bankStatus?: BankStatus
): RiskAnalysis {
  const factors: RiskFactor[] = [];
  let fraudScore = 0;
  let failProb = 0;

  // Fraud risk
  if (amount > 10000) { factors.push({ name: "High Amount", score: 30 }); fraudScore += 30; }
  if (Math.random() > 0.75) { factors.push({ name: "New Device", score: 25 }); fraudScore += 25; }
  if (new Date().getHours() < 6 || new Date().getHours() > 23) {
    factors.push({ name: "Unusual Time", score: 20 }); fraudScore += 20;
  }
  if (Math.random() > 0.8) { factors.push({ name: "Rapid Transactions", score: 25 }); fraudScore += 25; }

  // Failure probability
  const networkSpeed = Math.random() * 5;
  if (networkSpeed < 1) { failProb += 30; }
  if (bankStatus?.status === "high-latency") { failProb += 25; }
  else if (bankStatus?.status === "down") { failProb += 50; }
  if (Math.random() > 0.7) { failProb += 20; } // peak traffic

  fraudScore = Math.min(fraudScore, 100);
  failProb = Math.min(failProb, 95);

  const networkStrength: RiskAnalysis["networkStrength"] =
    networkSpeed > 3 ? "strong" : networkSpeed > 1 ? "moderate" : "slow";

  const bankServerStatus = bankStatus?.status || "operational";

  const decision: RiskAnalysis["decision"] =
    fraudScore < 40 ? "safe" : fraudScore <= 70 ? "otp" : "blocked";

  let recommendation = "Transaction looks safe. Proceed with payment.";
  if (fraudScore >= 70) recommendation = "High fraud risk detected. Transaction blocked for security.";
  else if (fraudScore >= 40) recommendation = "Moderate risk. OTP verification recommended.";
  else if (failProb > 50) recommendation = "High failure probability. Retry after a few seconds or choose another bank.";
  else if (failProb > 30) recommendation = "Moderate failure probability. Continue with caution.";

  return { fraudRiskScore: fraudScore, failureProbability: failProb, networkStrength, bankServerStatus, recommendation, riskFactors: factors, decision };
}

const RECIPIENTS = [
  { name: "Rahul", upiId: "rahul@upi" },
  { name: "Priya", upiId: "priya@ybl" },
  { name: "Amit", upiId: "amit@paytm" },
  { name: "Sneha", upiId: "sneha@upi" },
  { name: "Vikram", upiId: "vikram@gpay" },
];

export function generateRandomTransaction(): Transaction {
  const r = RECIPIENTS[Math.floor(Math.random() * RECIPIENTS.length)];
  const amount = Math.floor(Math.random() * 15000) + 100;
  const analysis = analyzeTransaction(amount);
  const status: Transaction["status"] =
    analysis.decision === "blocked" ? "failed" :
    analysis.failureProbability > 60 ? "failed" :
    Math.random() > 0.1 ? "success" : "pending";

  return {
    id: generateTransactionId(),
    recipient: r.name,
    upiId: r.upiId,
    amount,
    riskScore: analysis.fraudRiskScore,
    failureProbability: analysis.failureProbability,
    status,
    decision: analysis.decision,
    riskFactors: analysis.riskFactors,
    timestamp: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)),
  };
}
