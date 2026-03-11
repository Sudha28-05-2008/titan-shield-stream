export interface RiskFactor {
  name: string;
  score: number;
}

export interface Transaction {
  id: string;
  amount: number;
  device: string;
  location: string;
  riskScore: number;
  decision: "Approved" | "OTP Required" | "Blocked";
  riskFactors: RiskFactor[];
  timestamp: Date;
  userId?: string;
}

export interface FraudAlert {
  id: string;
  title: string;
  user: string;
  amount: number;
  reason: string;
  action: string;
  timestamp: Date;
  severity: "high" | "critical" | "medium";
}

export interface SystemLog {
  id: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  timestamp: Date;
}

const DEVICES = ["Android", "iPhone", "Desktop", "iPad", "Samsung"];
const LOCATIONS = ["Chennai", "Mumbai", "Delhi", "Bangalore", "Pune", "Kolkata", "Hyderabad", "Jaipur"];
const NAMES = ["98427XXXXX", "97865XXXXX", "90123XXXXX", "88765XXXXX", "93456XXXXX"];

let txnCounter = 88230;

export function generateTransactionId(): string {
  txnCounter++;
  return `TXN${txnCounter}`;
}

export interface SimulationParams {
  highAmount?: boolean;
  newDevice?: boolean;
  vpnDetected?: boolean;
  highVelocity?: boolean;
  dormantAccount?: boolean;
  bruteForce?: boolean;
  geoVelocity?: boolean;
  sessionHijack?: boolean;
  amount?: number;
}

export function calculateRisk(params: SimulationParams): { score: number; factors: RiskFactor[] } {
  const factors: RiskFactor[] = [];
  let score = 0;

  const amount = params.amount ?? Math.floor(Math.random() * 5000) + 100;

  if (params.highAmount || amount > 10000) {
    const s = 30;
    factors.push({ name: "High Amount", score: s });
    score += s;
  }
  if (params.newDevice) {
    factors.push({ name: "New Device", score: 25 });
    score += 25;
  }
  if (params.vpnDetected) {
    factors.push({ name: "VPN / Proxy Detected", score: 20 });
    score += 20;
  }
  if (params.highVelocity) {
    factors.push({ name: "High Velocity", score: 25 });
    score += 25;
  }
  if (params.dormantAccount) {
    factors.push({ name: "Dormant Account", score: 20 });
    score += 20;
  }
  if (params.bruteForce) {
    factors.push({ name: "Brute Force Attempt", score: 30 });
    score += 30;
  }
  if (params.geoVelocity) {
    factors.push({ name: "Geo Velocity Anomaly", score: 35 });
    score += 35;
  }
  if (params.sessionHijack) {
    factors.push({ name: "Session Hijack", score: 30 });
    score += 30;
  }

  // Add some baseline noise
  if (factors.length === 0) {
    const baseRisk = Math.floor(Math.random() * 25);
    if (baseRisk > 10) {
      factors.push({ name: "Behavioral Anomaly", score: baseRisk });
    }
    score += baseRisk;
  }

  return { score: Math.min(score, 100), factors };
}

export function getDecision(riskScore: number): Transaction["decision"] {
  if (riskScore < 40) return "Approved";
  if (riskScore <= 70) return "OTP Required";
  return "Blocked";
}

export function generateRandomTransaction(): Transaction {
  const amount = Math.floor(Math.random() * 20000) + 100;
  const params: SimulationParams = {
    highAmount: amount > 10000,
    newDevice: Math.random() > 0.8,
    vpnDetected: Math.random() > 0.9,
    highVelocity: Math.random() > 0.85,
    amount,
  };
  const { score, factors } = calculateRisk(params);
  const decision = getDecision(score);

  return {
    id: generateTransactionId(),
    amount,
    device: DEVICES[Math.floor(Math.random() * DEVICES.length)],
    location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
    riskScore: score,
    decision,
    riskFactors: factors,
    timestamp: new Date(),
  };
}

export function generateScenarioTransaction(scenario: string): Transaction {
  let params: SimulationParams = {};
  let amount = 0;

  switch (scenario) {
    case "new-device":
      amount = 15000;
      params = { newDevice: true, highAmount: true, amount };
      break;
    case "high-amount":
      amount = 75000;
      params = { highAmount: true, amount };
      break;
    case "account-takeover":
      amount = 50000;
      params = { newDevice: true, highAmount: true, highVelocity: true, amount };
      break;
    case "vpn-abuse":
      amount = 8000;
      params = { vpnDetected: true, highVelocity: true, amount };
      break;
    case "limit-breach":
      amount = 95000;
      params = { highAmount: true, highVelocity: true, amount };
      break;
    case "dormant":
      amount = 25000;
      params = { dormantAccount: true, highAmount: true, amount };
      break;
    case "session-hijack":
      amount = 30000;
      params = { sessionHijack: true, newDevice: true, amount };
      break;
    case "brute-force":
      amount = 5000;
      params = { bruteForce: true, amount };
      break;
    case "geo-velocity":
      amount = 12000;
      params = { geoVelocity: true, highAmount: true, amount };
      break;
    case "txn-velocity":
      amount = 2000;
      params = { highVelocity: true, amount };
      break;
    default:
      amount = 5000;
      params = { amount };
  }

  const { score, factors } = calculateRisk(params);
  const decision = getDecision(score);

  return {
    id: generateTransactionId(),
    amount,
    device: DEVICES[Math.floor(Math.random() * DEVICES.length)],
    location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
    riskScore: score,
    decision,
    riskFactors: factors,
    timestamp: new Date(),
    userId: NAMES[Math.floor(Math.random() * NAMES.length)],
  };
}

export function generateFraudAlert(txn: Transaction): FraudAlert | null {
  if (txn.decision === "Approved") return null;
  return {
    id: `ALT-${Date.now()}`,
    title: "Suspicious Transaction Detected",
    user: txn.userId || NAMES[Math.floor(Math.random() * NAMES.length)],
    amount: txn.amount,
    reason: txn.riskFactors.map((f) => f.name).join(" + "),
    action: txn.decision === "Blocked" ? "Transaction Blocked" : "OTP Required",
    timestamp: new Date(),
    severity: txn.riskScore > 70 ? "critical" : txn.riskScore > 50 ? "high" : "medium",
  };
}
