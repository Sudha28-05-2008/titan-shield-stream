import { useApp } from "@/context/AppContext";
import TransactionFeed from "@/components/TransactionFeed";

export default function Transactions() {
  const { transactions } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
        <p className="text-sm text-muted-foreground mt-1">{transactions.length} transactions processed</p>
      </div>
      <TransactionFeed transactions={transactions} showRiskBreakdown />
    </div>
  );
}
